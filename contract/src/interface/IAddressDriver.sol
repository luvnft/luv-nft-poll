// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IAddressDriver {
    type MaxEndHints is uint256;
    type StreamConfig is uint256;

    struct AccountMetadata {
        bytes32 key;
        bytes value;
    }

    struct SplitsReceiver {
        uint256 accountId;
        uint256 weight;
    }

    struct StreamReceiver {
        uint256 accountId;
        StreamConfig config;
    }

    event AdminChanged(address previousAdmin, address newAdmin);
    event BeaconUpgraded(address indexed beacon);
    event NewAdminProposed(
        address indexed currentAdmin,
        address indexed newAdmin
    );
    event Upgraded(address indexed implementation);

    function acceptAdmin() external;
    function admin() external view returns (address);
    function calcAccountId(
        address addr
    ) external view returns (uint256 accountId);
    function collect(
        address erc20,
        address transferTo
    ) external returns (uint128 amt);
    function drips() external view returns (address);
    function driverId() external view returns (uint32);
    function emitAccountMetadata(
        AccountMetadata[] memory accountMetadata
    ) external;
    function give(uint256 receiver, address erc20, uint128 amt) external;
    function implementation() external view returns (address);
    function isTrustedForwarder(address forwarder) external view returns (bool);
    function proposeNewAdmin(address newAdmin) external;
    function proposedAdmin() external view returns (address);
    function proxiableUUID() external view returns (bytes32);
    function renounceAdmin() external;
    function setSplits(SplitsReceiver[] memory receivers) external;
    function setStreams(
        address erc20,
        StreamReceiver[] memory currReceivers,
        int128 balanceDelta,
        StreamReceiver[] memory newReceivers,
        MaxEndHints maxEndHints,
        address transferTo
    ) external returns (int128 realBalanceDelta);
    function upgradeTo(address newImplementation) external;
    function upgradeToAndCall(
        address newImplementation,
        bytes memory data
    ) external payable;
}
