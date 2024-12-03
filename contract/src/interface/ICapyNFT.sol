// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICapyNFT {
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);
    error ERC721InsufficientApproval(address operator, uint256 tokenId);
    error ERC721InvalidApprover(address approver);
    error ERC721InvalidOperator(address operator);
    error ERC721InvalidOwner(address owner);
    error ERC721InvalidReceiver(address receiver);
    error ERC721InvalidSender(address sender);
    error ERC721NonexistentToken(uint256 tokenId);
    error OwnableInvalidOwner(address owner);
    error OwnableUnauthorizedAccount(address account);

    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
    event MetadataUpdate(uint256 _tokenId);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function approve(address to, uint256 tokenId) external;
    function balanceOf(address owner) external view returns (uint256);
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function name() external view returns (string memory);
    function owner() external view returns (address);
    function ownerOf(uint256 tokenId) external view returns (address);
    function renounceOwnership() external;
    function safeMint(address to, string memory uri) external returns (uint256 tokenId);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;
    function setApprovalForAll(address operator, bool approved) external;
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function transferOwnership(address newOwner) external;
}
