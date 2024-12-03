// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {INFTDriver} from "./interface/INFTDriver.sol";
import {IDrips} from "./interface/IDrips.sol";
import {ICapyNFT} from "./interface/ICapyNFT.sol";
import {StreamConfigImpl} from "./StreamConfig.sol";

/**
 * @title CapyCore
 * @dev Core contract for managing Capy functionality, integrating with Drips protocol
 */
contract CapyCore is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Must match Drips.AMT_PER_SEC_MULTIPLIER
    uint160 private constant AMT_PER_SEC_MULTIPLIER = 1_000_000_000;
    INFTDriver public nftDriver;
    IDrips public dripsContract;
    ICapyNFT public capyNFT;

    mapping(uint256 => uint256) public poolIdToDripsAccount;
    mapping(uint256 => uint256) public capyNftToDripsAccount;

    // Mapping to store Capy NFTs for each pool
    mapping(uint256 => mapping(uint256 => bool)) public poolIdToCapyNFTs;

    // Mapping to store whitelisted collectors for each pool
    mapping(uint256 => mapping(address => bool))
        public poolIdToWhitelistedCollectors;
    // Counter to track the number of whitelisted collectors for each pool
    mapping(uint256 => uint256) public whitelistedCollectorsCount;

    /**
     * @dev Emitted when a stream is set up and an NFT is minted
     * @param poolId Unique identifier for the pool
     * @param token ERC20 token being distributed
     * @param recipient Address of the recipient
     * @param recipientDriverAccountId Drips account ID associated with the recipient
     * @param capyNftId ID of the minted Capy NFT
     * @param amountPerSecond Amount streamed per second
     * @param duration Total duration of the stream in seconds
     * @param totalAllocation Total amount allocated to this recipient
     */
    event StreamSetup(
        uint256 indexed poolId,
        IERC20 token,
        address indexed recipient,
        uint256 indexed recipientDriverAccountId,
        uint256 capyNftId,
        uint256 amountPerSecond,
        uint32 duration,
        uint256 totalAllocation
    );
    event DistributionHandled(uint256 indexed poolId, IERC20 indexed token);
    event FundsTransferred(
        uint256 indexed poolId,
        uint256 indexed capyNftId,
        address indexed recipient,
        uint128 collected
    );
    event WhitelistedCollectorUpdated(
        uint256 indexed poolId,
        address indexed collector,
        bool isWhitelisted
    );

    /**
     * @dev Constructor to initialize the contract with necessary addresses
     * @param _nftDriverAddress Address of the NFTDriver contract
     * @param _dripsContract Address of the Drips contract
     * @param _capyNFTAddress Address of the CapyNFT contract
     */
    constructor(
        address _nftDriverAddress,
        address _dripsContract,
        address _capyNFTAddress
    ) {
        nftDriver = INFTDriver(_nftDriverAddress);
        dripsContract = IDrips(_dripsContract);
        capyNFT = ICapyNFT(_capyNFTAddress);
    }

    /**
     * @dev Handles the distribution of tokens to multiple recipients
     * @param poolId Unique identifier for the pool
     * @param token ERC20 token being distributed
     * @param recipients Array of recipient addresses
     * @param allocations Array of allocation amounts for each recipient
     * @param duration Total duration of the stream in seconds
     */
    function handleDistribution(
        uint256 poolId,
        IERC20 token,
        address[] memory recipients,
        uint256[] memory allocations,
        uint32 duration,
        address[] memory whitelistedCollectors
    ) external nonReentrant {
        // TODO: let it do a transfer from the strategy
        require(duration != 0, "Duration is zero");
        require(recipients.length > 0, "No recipients provided");
        require(
            recipients.length == allocations.length,
            "Mismatched recipients and allocations"
        );

        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAllocation += allocations[i];
        }

        uint256 balance = token.balanceOf(address(this));
        require(
            balance >= totalAllocation,
            "Insufficient balance for distribution"
        );

        // Mint a Drips NFT stream account for the pool funds
        uint256 poolDriverAccountId = nftDriver.mint(
            address(this),
            noMetadata()
        );
        poolIdToDripsAccount[poolId] = poolDriverAccountId;

        INFTDriver.StreamReceiver[]
            memory receivers = new INFTDriver.StreamReceiver[](
                recipients.length
            );

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 allocation = allocations[i];
            uint256 amountPerSecond = (allocation * AMT_PER_SEC_MULTIPLIER) /
                duration;

            // Mint a Drips NFT funds account for the recipient funds
            uint256 recipientDriverAccountId = nftDriver.mint(
                address(this),
                noMetadata()
            );

            // Mint a Capy NFT and send to recipient as proof of funds account ownership
            uint256 capyNftId = capyNFT.safeMint(recipient, "");
            capyNftToDripsAccount[capyNftId] = recipientDriverAccountId;

            // Add Capy NFT to the pool's mapping
            poolIdToCapyNFTs[poolId][capyNftId] = true;

            // Add recipient address and stream configuration
            receivers[i] = INFTDriver.StreamReceiver(
                recipientDriverAccountId,
                StreamConfigImpl.create(
                    0,
                    uint160(amountPerSecond),
                    0,
                    duration
                )
            );

            emit StreamSetup(
                poolId,
                token,
                recipient,
                recipientDriverAccountId,
                capyNftId,
                amountPerSecond,
                duration,
                allocation
            );
        }

        require(
            token.approve(address(nftDriver), totalAllocation),
            "Failed to approve NFTDriver"
        );

        // Set stream from pool fund to recipients
        nftDriver.setStreams(
            poolDriverAccountId,
            address(token),
            new INFTDriver.StreamReceiver[](0),
            int128(int256(totalAllocation)),
            receivers,
            INFTDriver.MaxEndHints.wrap(0),
            address(this)
        );

        for (uint256 i = 0; i < whitelistedCollectors.length; i++) {
            updateWhitelistedCollector(poolId, whitelistedCollectors[i], true);
        }

        emit DistributionHandled(poolId, token);
    }

    /**
     * @dev Transfers funds from an Capy NFT to a recipient
     * @param poolId ID of the pool
     * @param capyNftId ID of the Capy NFT
     * @param recipient Address of the recipient
     * @param maxCycles Maximum number of cycles to receive
     * @param token ERC20 token to transfer
     */
    function transfer(
        uint256 poolId,
        uint256 capyNftId,
        address recipient,
        uint32 maxCycles,
        IERC20 token
    ) external nonReentrant returns (uint128 collected) {
        require(
            capyNFT.ownerOf(capyNftId) == msg.sender,
            "Caller is not the owner of the Capy NFT"
        );

        uint256 dripsAccountId = capyNftToDripsAccount[capyNftId];
        require(
            dripsAccountId != 0,
            "No Drips account associated with this Capy NFT"
        );

        // Check if the transfer is valid based on whitelisting rules
        require(
            isValidTransfer(poolId, capyNftId, recipient),
            "Transfer not allowed"
        );

        if (maxCycles > 0) {
            dripsContract.receiveStreams(
                dripsAccountId,
                address(token),
                maxCycles
            );
        }

        uint128 amountToSplit = dripsContract.splittable(
            dripsAccountId,
            address(token)
        );

        if (amountToSplit > 0) {
            (uint128 splitAmount, ) = dripsContract.split(
                dripsAccountId,
                token,
                new IDrips.SplitsReceiver[](0)
            );
            require(
                splitAmount >= amountToSplit,
                "Split amount less than expected"
            );
        }

        uint128 amountToCollect = dripsContract.collectable(
            dripsAccountId,
            address(token)
        );

        if (amountToCollect > 0) {
            collected = nftDriver.collect(
                dripsAccountId,
                address(token),
                recipient
            );

            require(
                collected >= amountToCollect,
                "Collect amount less than expected"
            );

            emit FundsTransferred(poolId, capyNftId, recipient, collected);
        }
    }

    /**
     * @dev Checks if a transfer is valid based on whitelisting rules
     * @param poolId ID of the pool
     * @param capyNftId ID of the Capy NFT
     * @param recipient Address of the recipient
     * @return bool indicating if the transfer is valid
     */
    function isValidTransfer(
        uint256 poolId,
        uint256 capyNftId,
        address recipient
    ) internal view returns (bool) {
        bool isNFTInPool = poolIdToCapyNFTs[poolId][capyNftId];

        // If there are no whitelisted collectors (count is 0), the transfer is valid if the NFT is in the pool
        if (whitelistedCollectorsCount[poolId] == 0) {
            return isNFTInPool;
        }

        // If there are whitelisted collectors, check if the recipient is whitelisted
        bool isRecipientWhitelisted = poolIdToWhitelistedCollectors[poolId][
            recipient
        ];

        // Transfer is valid if the NFT is in the pool and the recipient is whitelisted
        return isNFTInPool && isRecipientWhitelisted;
    }

    // TODO: add access control
    /**
     * @dev Updates the whitelist status of a collector for a specific pool
     * @param poolId ID of the pool
     * @param collector Address of the collector
     * @param isWhitelisted Boolean indicating whether the collector should be whitelisted
     */
    function updateWhitelistedCollector(
        uint256 poolId,
        address collector,
        bool isWhitelisted
    ) internal {
        bool wasWhitelisted = poolIdToWhitelistedCollectors[poolId][collector];

        if (isWhitelisted != wasWhitelisted) {
            poolIdToWhitelistedCollectors[poolId][collector] = isWhitelisted;

            if (isWhitelisted) {
                whitelistedCollectorsCount[poolId]++;
            } else {
                whitelistedCollectorsCount[poolId]--;
            }
        }

        emit WhitelistedCollectorUpdated(poolId, collector, isWhitelisted);
    }

    /**
     * @dev Squeezes streams for an Capy NFT
     * @param capyNftId ID of the Capy NFT
     * @param token ERC20 token of the stream
     * @param senderId ID of the sender account
     * @param historyHash Hash of the sender's streams history
     * @param streamsHistory Array of the sender's streams history
     */
    function squeezeStreams(
        uint256 capyNftId,
        IERC20 token,
        uint256 senderId,
        bytes32 historyHash,
        IDrips.StreamsHistory[] memory streamsHistory
    ) external nonReentrant {
        require(
            capyNFT.ownerOf(capyNftId) == msg.sender,
            "Caller is not the owner of the Capy NFT"
        );
        uint256 dripsAccountId = capyNftToDripsAccount[capyNftId];
        require(
            dripsAccountId != 0,
            "No Drips account associated with this Capy NFT"
        );

        dripsContract.squeezeStreams(
            dripsAccountId,
            address(token),
            senderId,
            historyHash,
            streamsHistory
        );
    }

    /**
     * @dev Gets the stream configuration for a specific pool and recipient
     * @param poolId ID of the pool
     * @param token ERC20 token of the stream
     * @param recipient Address of the recipient
     * @return startTime Start time of the stream
     * @return stopTime Stop time of the stream
     * @return amountPerSecond Amount streamed per second
     */
    function getStreamConfig(
        uint256 poolId,
        IERC20 token,
        address recipient
    )
        external
        view
        returns (uint256 startTime, uint256 stopTime, uint256 amountPerSecond)
    {
        // uint256 senderAccountId = poolIdToDripsAccount[poolId];
        // uint256 receiverAccountId = capyNftToDripsAccount[capyNFT.tokenOfOwnerByIndex(recipient, 0)];
        // (bytes32 streamsHash, , uint32 updateTime, uint128 balance, uint32 maxEnd) = nftDriver.streamsState(senderAccountId, token);
        // IDrips.StreamReceiver[] memory receivers = abi.decode(abi.encodePacked(streamsHash), (IDrips.StreamReceiver[]));
        // for (uint256 i = 0; i < receivers.length; i++) {
        //     if (receivers[i].accountId == receiverAccountId) {
        //         (uint32 start, uint160 amtPerSec) = StreamConfigImpl.getConfig(receivers[i].config);
        //         return (updateTime, maxEnd, uint256(amtPerSec));
        //     }
        // }
        // revert("Stream not found");
    }

    /**
     * @dev Gets the available balance for an Capy NFT
     * @param capyNftId ID of the Capy NFT
     * @param token ERC20 token to check balance for
     * @return Available balance
     */
    function getAvailableBalance(
        uint256 capyNftId,
        IERC20 token
    ) external view returns (uint256) {
        uint256 dripsAccountId = capyNftToDripsAccount[capyNftId];
        require(
            dripsAccountId != 0,
            "No Drips account associated with this Capy NFT"
        );
        return
            dripsContract.balanceAt(
                dripsAccountId,
                address(token),
                new IDrips.StreamReceiver[](0),
                uint32(block.timestamp)
            );
    }

    /**
     * @dev Helper function to create empty metadata
     * @return accountMetadata Empty array of AccountMetadata
     */
    function noMetadata()
        internal
        pure
        returns (INFTDriver.AccountMetadata[] memory accountMetadata)
    {
        accountMetadata = new INFTDriver.AccountMetadata[](0);
    }
}
