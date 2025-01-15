// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CapyCore} from "./../src/CapyCore.sol";
import {CapyPoll} from "./../src/CapyPoll.sol";
import {PollToken} from "./../src/PollToken.sol";

contract DeployCapyPolls is Script {
    CapyPoll public pollImplementation;
    PollToken public tokenImplementation;
    CapyCore public capyCore;

    function run() external {
        // Load configuration from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address usdeToken = 0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27;
        address susdeToken = 0x3a65168B746766066288B83417329a7F901b5569;

        console.log("Starting deployment with deployer:", deployer);
        console.log("USDe Token:", usdeToken);
        console.log("SUSDe Token:", susdeToken);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation contracts first
        pollImplementation = new CapyPoll();
        console.log(
            "Poll Implementation deployed at:",
            address(pollImplementation)
        );

        tokenImplementation = new PollToken();
        console.log(
            "Token Implementation deployed at:",
            address(tokenImplementation)
        );

        // Deploy CapyCore with implementations
        capyCore = new CapyCore(
            address(pollImplementation), // Poll implementation for cloning
            address(tokenImplementation), // Token implementation for cloning
            usdeToken, // USDe token address
            susdeToken, // SUSDe token address
            deployer // Initial owner
        );
        console.log("CapyCore deployed at:", address(capyCore));

        vm.stopBroadcast();

        // Log final configuration
        console.log("\nDeployment completed!");
        console.log("-------------------");
        console.log("Poll Implementation:", address(pollImplementation));
        console.log("Token Implementation:", address(tokenImplementation));
        console.log("CapyCore:", address(capyCore));

        // Verify key configurations
        verify();
    }

    function verify() internal view {
        // Verify CapyCore configuration
        require(address(capyCore) != address(0), "CapyCore not deployed");

        // Verify implementations are set
        (bool exists, ) = capyCore.getPollDetails(address(pollImplementation));

        require(
            !exists,
            "Poll implementation should not be registered as a poll"
        );

        // Verify core functionality
        require(
            capyCore.cloneablePoll() == address(pollImplementation),
            "Invalid poll implementation"
        );

        require(
            capyCore.cloneableToken() == address(tokenImplementation),
            "Invalid token implementation"
        );

        // require(address(mockUsde) != address(0), "MockUSDe not deployed");
        // require(address(mockSusde) != address(0), "MockSUSDe not deployed");

        console.log("Verification passed");
    }
}

/*
# Deployment Instructions:

# 1. Set environment variables:
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 2. Run deployment:
forge script script/DeployContracts.s.sol:DeployCapyPolls \
--rpc-url 127.0.0.1:8545 \
--broadcast -vvvv

# 3. transfer USDe into users wallet
export UNLUCKY_USER=0x5e869af2Af006B538f9c6D231C31DE7cDB4153be
export ME=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export USDe=0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27

cast call $USDe \
  "balanceOf(address)(uint256)" \
  $UNLUCKY_USER

cast rpc anvil_impersonateAccount $UNLUCKY_USER
cast send $USDe \
--from $UNLUCKY_USER \
  "transfer(address,uint256)(bool)" \
  $ME \
  4000000000000000000 \
  --unlocked

cast call $USDe \
  "balanceOf(address)(uint256)" \
  $ME

*/



/* 

Verify contracts:
forge verify-contract CONTRACT_ADDRESS \
--chain-id CHAIN_ID \
--constructor-args $(cast abi-encode "constructor(address,address,address,address,address)" POLL_IMPL TOKEN_IMPL USDE_TOKEN SUSDE_TOKEN OWNER) \
--etherscan-api-key YOUR_API_KEY

*/