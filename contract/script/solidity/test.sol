// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CapyUSDeStakeRouter} from "../../src/CapyUSDeStakeRouter.sol";

contract MyScript is Script {
    function run() external {
        // Private key for deployer account
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get existing router contract
        CapyUSDeStakeRouter router = CapyUSDeStakeRouter(0x8107cFe5eCa96972eFf1DF00A4d43e45559F226c); // Replace with actual router address

        // Get USDe token contract
        IERC20 usde = IERC20(0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696);

        // Approve router to spend USDe
        usde.approve(address(router), 1 ether);

        // Fund pool with 1 USDe
        router.fundAlloPool(9, 1 ether);

        vm.stopBroadcast();
    }
}

// To run this script:
// forge script script/solidity/test.sol:MyScript \
// --rpc-url  https://eth-sepolia.g.alchemy.com/v2/vEVKURyIJBdxxahH6eQJOSpjtIe3kA6- \
// --broadcast -vvvv
