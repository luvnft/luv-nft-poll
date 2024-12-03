// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface INFTDriver {
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
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event BeaconUpgraded(address indexed beacon);
    event NewAdminProposed(address indexed currentAdmin, address indexed newAdmin);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Upgraded(address indexed implementation);

    function acceptAdmin() external;
    function admin() external view returns (address);
    function approve(address to, uint256 tokenId) external;
    function balanceOf(address owner) external view returns (uint256);
    function burn(uint256 tokenId) external;
    function calcTokenIdWithSalt(address minter, uint64 salt) external view returns (uint256 tokenId);
    function collect(uint256 tokenId, address erc20, address transferTo) external returns (uint128 amt);
    function drips() external view returns (address);
    function driverId() external view returns (uint32);
    function emitAccountMetadata(uint256 tokenId, AccountMetadata[] memory accountMetadata) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function give(uint256 tokenId, uint256 receiver, address erc20, uint128 amt) external;
    function implementation() external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function isSaltUsed(address minter, uint64 salt) external view returns (bool isUsed);
    function isTrustedForwarder(address forwarder) external view returns (bool);
    function mint(address to, AccountMetadata[] memory accountMetadata) external returns (uint256 tokenId);
    function mintWithSalt(uint64 salt, address to, AccountMetadata[] memory accountMetadata)
        external
        returns (uint256 tokenId);
    function name() external pure returns (string memory);
    function nextTokenId() external view returns (uint256 tokenId);
    function ownerOf(uint256 tokenId) external view returns (address);
    function proposeNewAdmin(address newAdmin) external;
    function proposedAdmin() external view returns (address);
    function proxiableUUID() external view returns (bytes32);
    function renounceAdmin() external;
    function safeMint(address to, AccountMetadata[] memory accountMetadata) external returns (uint256 tokenId);
    function safeMintWithSalt(uint64 salt, address to, AccountMetadata[] memory accountMetadata)
        external
        returns (uint256 tokenId);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;
    function setApprovalForAll(address operator, bool approved) external;
    function setSplits(uint256 tokenId, SplitsReceiver[] memory receivers) external;
    function setStreams(
        uint256 tokenId,
        address erc20,
        StreamReceiver[] memory currReceivers,
        int128 balanceDelta,
        StreamReceiver[] memory newReceivers,
        MaxEndHints maxEndHints,
        address transferTo
    ) external returns (int128 realBalanceDelta);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function symbol() external pure returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function upgradeTo(address newImplementation) external;
    function upgradeToAndCall(address newImplementation, bytes memory data) external payable;
}