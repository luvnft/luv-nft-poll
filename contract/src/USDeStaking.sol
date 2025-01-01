// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract USDeStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Token contracts
    IERC20 public immutable usdeToken;
    IERC20 public immutable susdeToken;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event EmergencyWithdrawn(address indexed user, uint256 amount);

    // Error messages
    error ZeroAmount();
    error InsufficientBalance();
    error TransferFailed();

    constructor(
        address _usdeToken,
        address _susdeToken,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_usdeToken != address(0), "Invalid USDe address");
        require(_susdeToken != address(0), "Invalid sUSDe address");
        
        usdeToken = IERC20(_usdeToken);
        susdeToken = IERC20(_susdeToken);
    }

    /**
     * @notice Stakes USDe tokens to receive sUSDe
     * @param amount Amount of USDe to stake
     */
    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // Transfer USDe from user
        usdeToken.safeTransferFrom(msg.sender, address(this), amount);

        // Approve sUSDe contract to spend USDe if needed
        if (usdeToken.allowance(address(this), address(susdeToken)) < amount) {
            usdeToken.approve(address(susdeToken), type(uint256).max);
        }

        // Get balance before staking
        uint256 susdeBalanceBefore = susdeToken.balanceOf(address(this));

        // Stake USDe to get sUSDe (this will vary based on the actual staking mechanism)
        bool success = IERC20(address(susdeToken)).transferFrom(
            address(this),
            msg.sender,
            amount
        );
        if (!success) revert TransferFailed();

        // Verify staking was successful
        uint256 susdeBalanceAfter = susdeToken.balanceOf(address(this));
        require(susdeBalanceAfter >= susdeBalanceBefore, "Staking failed");

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraws staked USDe tokens
     * @param amount Amount of sUSDe to unstake
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // Transfer sUSDe from user
        susdeToken.safeTransferFrom(msg.sender, address(this), amount);

        // Approve USDe contract to spend sUSDe if needed
        if (susdeToken.allowance(address(this), address(usdeToken)) < amount) {
            susdeToken.approve(address(usdeToken), type(uint256).max);
        }

        // Get balance before unstaking
        uint256 usdeBalanceBefore = usdeToken.balanceOf(address(this));

        // Unstake sUSDe to get USDe back
        bool success = IERC20(address(usdeToken)).transferFrom(
            address(this),
            msg.sender,
            amount
        );
        if (!success) revert TransferFailed();

        // Verify unstaking was successful
        uint256 usdeBalanceAfter = usdeToken.balanceOf(address(this));
        require(usdeBalanceAfter >= usdeBalanceBefore, "Unstaking failed");

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Emergency withdraw function in case of contract issues
     * @param token Token address to withdraw
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance == 0) revert InsufficientBalance();

        IERC20(token).safeTransfer(owner(), balance);
        emit EmergencyWithdrawn(owner(), balance);
    }
}
