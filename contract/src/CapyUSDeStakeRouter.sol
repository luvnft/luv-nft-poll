// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title CapyUSDeStakeRouter
/// @notice Router contract for staking USDe and funding Allo pools with sUSDe
contract CapyUSDeStakeRouter is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ====================================
    // =========== Errors =================
    // ====================================

    /// @notice Thrown when amount is 0 or insufficient
    error NOT_ENOUGH_FUNDS();

    /// @notice Thrown when deposit fails
    error DEPOSIT_FAILED();

    /// @notice Thrown when funding pool fails
    error FUND_POOL_FAILED();

    // ====================================
    // =========== Storage ===============
    // ====================================

    IERC20 public immutable usde;
    IERC20 public immutable sUsde;
    address public immutable alloContract;

    constructor(address _usde, address _sUsde, address _alloContract) {
        usde = IERC20(_usde);
        sUsde = IERC20(_sUsde);
        alloContract = _alloContract;

        // Approve sUsde to be spent by Allo contract
        sUsde.approve(_alloContract, type(uint256).max);
    }

    /// @notice Fund an Allo pool by first staking USDe to get sUSDe
    /// @dev User must approve this contract to spend their USDe
    /// @param _poolId ID of the pool in Allo
    /// @param _amount The amount of USDe to stake and fund
    function fundAlloPool(uint256 _poolId, uint256 _amount) external nonReentrant {
        // Check amount
        if (_amount == 0) revert NOT_ENOUGH_FUNDS();

        // Transfer USDe from user to this contract
        usde.safeTransferFrom(msg.sender, address(this), _amount);

        // Get initial sUSDe balance
        uint256 initialSUsdeBalance = sUsde.balanceOf(address(this));

        // Stake USDe to get sUSDe
        usde.approve(address(sUsde), _amount);
        // Call deposit function on sUsde contract to stake USDe
        (bool success, ) = address(sUsde).call(
            abi.encodeWithSignature(
                "deposit(uint256,address)",
                _amount,
                address(this)
            )
        );
        if (!success) revert DEPOSIT_FAILED();

        // Calculate actual sUSDe received
        uint256 sUsdeReceived = sUsde.balanceOf(address(this)) - initialSUsdeBalance;

        // Fund the Allo pool with sUSDe
        (success,) = alloContract.call(
            abi.encodeWithSignature(
                "fundPool(uint256,uint256)", 
                _poolId,
                sUsdeReceived
            )
        );
        if (!success) revert FUND_POOL_FAILED();
    }
}