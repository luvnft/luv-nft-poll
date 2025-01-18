use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid duration. Maximum allowed is {max} seconds")]
    InvalidDuration { max: u64 },

    #[error("Invalid XION denom")]
    InvalidXionDenom {},

    #[error("Invalid address: {0}")]
    InvalidAddress(String),

    #[error("Address has no code: {0}")]
    AddressEmptyCode(String),

    #[error("No XION payment found")]
    NoXionPayment {},

    #[error("Invalid payment amount")]
    InvalidPaymentAmount {},

    #[error("Poll not resolved")]
    PollNotResolved {},

    #[error("Poll already resolved")]
    PollAlreadyResolved {},

    #[error("Poll has ended")]
    PollEnded {},

    #[error("Poll is still active")]
    PollStillActive {},

    #[error("Failed inner call")]
    FailedInnerCall {},

    #[error("Epoch not started")]
    EpochNotStarted {},

    #[error("Epoch not ended")]
    EpochNotEnded {},

    #[error("Epoch already distributed")]
    EpochAlreadyDistributed {},

    #[error("No stakes to withdraw")]
    NoStakesToWithdraw {},
} 