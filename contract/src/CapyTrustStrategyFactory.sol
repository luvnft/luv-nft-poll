// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "openzeppelin-contracts-upgradeable/contracts/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./CapyTrustStrategy.sol";

contract CapyTrustStrategyFactory is Ownable {
    event StrategyCreated(
        address indexed owner,
        address indexed strategyAddress,
        string name,
        string avatar,
        string description
    );

    CapyTrustStrategy[] public strategies;

    address public currentStrategy;

    /// @notice Maps the `msg.sender` to a `nonce` to prevent duplicates
    /// @dev 'msg.sender' -> 'nonce' for cloning strategies
    mapping(address => uint256) private _nonces;

    constructor(address _currentStrategy) {
        require(_currentStrategy != address(0), "Invalid strategy address");
        currentStrategy = _currentStrategy;
    }

    /// @notice Creates a new CapyTrustStrategy contract
    /// @return strategy Address of the newly created strategy
    function createStrategy(
        string memory name,
        string memory avatar,
        string memory description
    ) external returns (address strategy) {
        bytes32 salt = keccak256(
            abi.encodePacked(msg.sender, _nonces[msg.sender]++)
        );

        // Return the address of the contract
        CapyTrustStrategy newStrategy = CapyTrustStrategy(
            ClonesUpgradeable.cloneDeterministic(currentStrategy, salt)
        );

        newStrategy.factoryInitialize();

        // Transfer ownership to msg.sender
        newStrategy.transferOwnership(msg.sender);

        strategies.push(newStrategy);

        emit StrategyCreated(
            msg.sender,
            address(newStrategy),
            name,
            avatar,
            description
        );

        strategy = address(newStrategy);
    }

    /// @notice Returns the number of strategies created
    /// @return uint256 Number of strategies
    function getStrategyCount() external view returns (uint256) {
        return strategies.length;
    }

    /// @notice Returns the strategy address at a specific index
    /// @param _index Index in the strategies array
    /// @return address Strategy address
    function getStrategyAt(uint256 _index) external view returns (address) {
        require(_index < strategies.length, "Index out of bounds");
        return address(strategies[_index]);
    }

    /// @notice Updates the strategy contract address
    /// @param _currentStrategy New strategy contract address
    function updateStrategyAddress(
        address _currentStrategy
    ) external onlyOwner {
        require(_currentStrategy != address(0), "Invalid Strategy address");
        currentStrategy = _currentStrategy;
    }

    /// @notice Checks if an address is a strategy created by this factory
    /// @param _strategyAddress Address to check
    /// @return bool True if the address is a strategy created by this factory
    function isStrategyFromFactory(
        address _strategyAddress
    ) external view returns (bool) {
        for (uint256 i = 0; i < strategies.length; i++) {
            if (address(strategies[i]) == _strategyAddress) {
                return true;
            }
        }
        return false;
    }
}
