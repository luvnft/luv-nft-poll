// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.10;

interface Caller {
    event Authorized(address indexed sender, address indexed authorized);
    event CalledAs(address indexed sender, address indexed authorized);
    event CalledSigned(address indexed sender, uint256 nonce);
    event EIP712DomainChanged();
    event NonceSet(address indexed sender, uint256 newNonce);
    event Unauthorized(address indexed sender, address indexed unauthorized);
    event UnauthorizedAll(address indexed sender);

    struct Call {
        address target;
        bytes data;
        uint256 value;
    }

    function MAX_NONCE_INCREASE() external view returns (uint256);
    function allAuthorized(address sender) external view returns (address[] memory authorized);
    function authorize(address user) external;
    function callAs(address sender, address target, bytes memory data)
        external
        payable
        returns (bytes memory returnData);
    function callBatched(Call[] memory calls) external payable returns (bytes[] memory returnData);
    function callSigned(address sender, address target, bytes memory data, uint256 deadline, bytes32 r, bytes32 sv)
        external
        payable
        returns (bytes memory returnData);
    function eip712Domain()
        external
        view
        returns (
            bytes1 fields,
            string memory name,
            string memory version,
            uint256 chainId,
            address verifyingContract,
            bytes32 salt,
            uint256[] memory extensions
        );
    function isAuthorized(address sender, address user) external view returns (bool authorized);
    function isTrustedForwarder(address forwarder) external view returns (bool);
    function nonce(address sender) external view returns (uint256);
    function setNonce(uint256 newNonce) external;
    function unauthorize(address user) external;
    function unauthorizeAll() external;
}