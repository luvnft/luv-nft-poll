use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Poll has ended")]
    PollEnded {},

    #[error("Poll still active")]
    PollStillActive {},

    #[error("Poll already resolved")]
    PollAlreadyResolved {},

    #[error("Cannot stake zero amount")]
    ZeroStake {},

    #[error("Invalid address: {0}")]
    InvalidAddress(String),

    #[error("Empty code at address: {0}")]
    AddressEmptyCode(String),

    #[error("Insufficient balance for address: {0}")]
    AddressInsufficientBalance(String),

    #[error("Failed inner call")]
    FailedInnerCall {},

    #[error("Invalid epoch")]
    InvalidEpoch {},

    #[error("Epoch not started")]
    EpochNotStarted {},

    #[error("Epoch already distributed")]
    EpochAlreadyDistributed {},

    #[error("Epoch not ended")]
    EpochNotEnded {},

    #[error("No stakes to withdraw")]
    NoStakesToWithdraw {},
} 