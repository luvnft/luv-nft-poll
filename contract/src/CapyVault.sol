// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "solmate/src/utils/FixedPointMathLib.sol";

interface IStakedUSDe {
    function cooldownAssets(uint256 assets) external;
    function cooldownShares(uint256 shares) external;
    function deposit(uint256 stake, address receiver) external;
    function unstake(address receiver) external;
}

/**
 * @title CapyFlow (CPFL)
 * @notice A yield-bearing wrapper for sUSDe with batched staking and unstaking mechanics
 */
contract CapyVault is ERC20 {
    using SafeTransferLib for ERC20;
    using FixedPointMathLib for uint256;

    // Errors
    error ZeroAmount();
    error CooldownNotComplete();
    error BatchNotFound();
    error BatchAlreadyClaimed();
    error InvalidBatchId();

    // Batch structure for tracking unstaking
    struct Batch {
        uint256 batchId;
        uint256 completionTime;
        uint256 amount;
        bool claimed;
    }

    // State variables
    ERC20 public immutable USDe; // The USDe token
    IStakedUSDe public immutable sUSDe; // The underlying sUSDe token
    uint256 public immutable COOLDOWN_DURATION; // Cooldown period in seconds
    uint256 internal _totalAssets; // Total amount of sUSDe held
    uint256 public currentBatchId; // Counter for batch IDs

    // Batch tracking
    mapping(address => Batch[]) public userBatches;

    // Events
    event Staked(
        address indexed user,
        uint256 sUSDeAmount,
        uint256 sharesReceived
    );
    event CooldownStarted(
        address indexed user,
        uint256 shares,
        uint256 batchId,
        uint256 completionTime
    );
    event Unstaked(address indexed user, uint256 sUSDeAmount, uint256 batchId);

    /**
     * @notice Initialize the CapyFlow contract
     * @param _sUSDe Address of the sUSDe token
     * @param _cooldownDuration Duration of cooldown in seconds
     */
    constructor(
        address _USDe,
        address _sUSDe,
        uint256 _cooldownDuration
    ) ERC20("CapyFlow", "CPFL", 18) {
        USDe = ERC20(_USDe);
        sUSDe = IStakedUSDe(_sUSDe);
        COOLDOWN_DURATION = _cooldownDuration;

        USDe.approve(address(sUSDe), type(uint256).max);

        // Initialize with small amount to prevent division by zero
        _stake(0.1e18, address(this));
    }

    /**
     * @notice Stake USDe and receive CPFL tokens
     * @param amount Amount of USDe to stake
     * @return shares Amount of CPFL tokens received
     */
    function stake(uint256 amount) external returns (uint256 shares) {
        if (amount == 0) revert ZeroAmount();
        return _stake(amount, msg.sender);
    }

    /**
     * @notice Internal staking logic
     * @param amount Amount of USDe to stake
     * @param receiver Address to receive CPFL tokens
     * @return shares Amount of CPFL tokens minted
     */
    function _stake(
        uint256 amount,
        address receiver
    ) internal returns (uint256 shares) {
        shares = _convertToShares(amount);
        if (shares == 0) revert ZeroAmount();

        USDe.safeTransferFrom(msg.sender, address(this), amount);
        sUSDe.deposit(amount, address(this));
        _totalAssets += amount;
        _mint(receiver, shares);

        emit Staked(receiver, amount, shares);
    }

    /**
     * @notice Start cooldown period for unstaking
     * @param shares Amount of CPFL tokens to unstake
     * @return batchId The ID of the created batch
     */
    function startCooldown(uint256 shares) external returns (uint256 batchId) {
        if (shares == 0) revert ZeroAmount();
        if (shares > balanceOf[msg.sender]) revert ZeroAmount();

        // Create new batch
        batchId = ++currentBatchId;
        uint256 completionTime = block.timestamp + COOLDOWN_DURATION;

        Batch memory newBatch = Batch({
            batchId: batchId,
            completionTime: completionTime,
            amount: shares,
            claimed: false
        });

        userBatches[msg.sender].push(newBatch);

        // Start cooldown in sUSDe contract
        uint256 assets = _convertToAssets(shares);
        sUSDe.cooldownAssets(assets);

        emit CooldownStarted(msg.sender, shares, batchId, completionTime);
    }

    /**
     * @notice Complete unstaking for a specific batch
     * @param batchId ID of the batch to unstake
     * @param receiver Address to receive unstaked sUSDe
     */
    function unstakeBatch(uint256 batchId, address receiver) external {
        Batch[] storage batches = userBatches[msg.sender];
        uint256 batchIndex = _findBatchIndex(msg.sender, batchId);
        Batch storage batch = batches[batchIndex];

        if (batch.claimed) revert BatchAlreadyClaimed();
        if (block.timestamp < batch.completionTime)
            revert CooldownNotComplete();

        uint256 sUSDeAmount = _convertToAssets(batch.amount);

        // Mark batch as claimed
        batch.claimed = true;

        // Burn CPFL tokens and update state
        _burn(msg.sender, batch.amount);
        _totalAssets -= sUSDeAmount;

        // Unstake from sUSDe contract
        sUSDe.unstake(address(this));

        // Transfer unstaked USDe to receiver
        ERC20(address(sUSDe)).safeTransfer(receiver, sUSDeAmount);

        emit Unstaked(receiver, sUSDeAmount, batchId);
    }

    /**
     * @notice Complete unstaking for all available batches
     * @param receiver Address to receive unstaked sUSDe
     * @return totalUnstaked Total amount of sUSDe unstaked
     */
    function unstakeAllAvailable(
        address receiver
    ) external returns (uint256 totalUnstaked) {
        Batch[] storage batches = userBatches[msg.sender];
        uint256 totalShares;

        for (uint256 i = 0; i < batches.length; i++) {
            if (
                !batches[i].claimed &&
                block.timestamp >= batches[i].completionTime
            ) {
                totalShares += batches[i].amount;
                batches[i].claimed = true;
            }
        }

        if (totalShares == 0) revert ZeroAmount();

        totalUnstaked = _convertToAssets(totalShares);

        // Burn CPFL tokens and update state
        _burn(msg.sender, totalShares);
        _totalAssets -= totalUnstaked;

        // Unstake from sUSDe contract
        sUSDe.unstake(address(this));

        // Transfer unstaked USDe to receiver
        ERC20(address(sUSDe)).safeTransfer(receiver, totalUnstaked);
    }

    /**
     * @notice Get all pending unstakes for a user
     * @param user Address to check
     * @return pendingBatches Array of unclaimed batches
     */
    function getPendingUnstakes(
        address user
    ) external view returns (Batch[] memory pendingBatches) {
        Batch[] storage batches = userBatches[user];
        uint256 pendingCount = 0;

        // Count pending batches
        for (uint256 i = 0; i < batches.length; i++) {
            if (!batches[i].claimed) {
                pendingCount++;
            }
        }

        // Create array of pending batches
        pendingBatches = new Batch[](pendingCount);
        uint256 index = 0;

        for (uint256 i = 0; i < batches.length; i++) {
            if (!batches[i].claimed) {
                pendingBatches[index] = batches[i];
                index++;
            }
        }
    }

    /**
     * @notice Find the index of a batch in the user's batch array
     * @param user Address of the user
     * @param batchId ID of the batch to find
     * @return Index of the batch
     */
    function _findBatchIndex(
        address user,
        uint256 batchId
    ) internal view returns (uint256) {
        Batch[] storage batches = userBatches[user];

        for (uint256 i = 0; i < batches.length; i++) {
            if (batches[i].batchId == batchId) {
                return i;
            }
        }

        revert BatchNotFound();
    }

    // Conversion functions remain the same
    function _convertToShares(
        uint256 assets
    ) internal view returns (uint256 shares) {
        uint256 supply = totalSupply;
        return supply == 0 ? assets : assets.mulDivDown(supply, _totalAssets);
    }

    function _convertToAssets(
        uint256 shares
    ) internal view returns (uint256 assets) {
        uint256 supply = totalSupply;
        return supply == 0 ? shares : shares.mulDivDown(_totalAssets, supply);
    }

    /**
     * @notice Get total sUSDe held by contract
     */
    function totalAssets() external view returns (uint256) {
        return _totalAssets;
    }

    /**
     * @notice Preview conversion from sUSDe to CPFL
     * @param assets Amount of sUSDe
     * @return Amount of CPFL tokens
     */
    function previewStake(uint256 assets) external view returns (uint256) {
        return _convertToShares(assets);
    }

    /**
     * @notice Preview conversion from CPFL to sUSDe
     * @param shares Amount of CPFL tokens
     * @return Amount of sUSDe
     */
    function previewUnstake(uint256 shares) external view returns (uint256) {
        return _convertToAssets(shares);
    }
}
