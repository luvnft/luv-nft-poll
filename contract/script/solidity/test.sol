// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../../lib/allo-v2/contracts/core/Allo.sol";
import "../../src/CapyTrustStrategy.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        Allo allo = Allo(address(0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0));

        allo.createPoolWithCustomStrategy(
            0xd4622f6f38d5db892468d96e7ecc6dd68b88b324f5671f6e27af6352377977e9,
            0x0De041Ecdc07C0335e8c8d7D3605f993733028b3,
            abi.encode(
                uint64(block.timestamp), // registrationStartTime (current timestamp)
                uint64(block.timestamp + 120), // registrationEndTime (2 mins from now)
                uint64(block.timestamp + 120), // allocationStartTime (2 mins from now) 
                uint64(block.timestamp + 240) // allocationEndTime (4 mins from now)
            ),
            0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1,
            10000000000000000000,
            Metadata({
                protocol: 1,
                pointer: "ipfs://example"
            }),
            new address[](0)
        );

        // address[] memory recipients = new address[](1);
        // recipients[0] = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
        // allo.distribute(1, recipients, abi.encode(uint32(180)));

        // CapyTrustStrategy strategy = CapyTrustStrategy(
        //     address(0x3F7b7c3fD6fABc3FE67BB21c0f164CBddcA1d614)
        // );
        // address alloAddress = address(strategy.getCapyCore());
        // console.logAddress(alloAddress);

        vm.stopBroadcast();
    }
}

// To run this script:
// forge script script/solidity/test.sol:MyScript --rpc-url http://localhost:8545 --broadcast -vvvv
