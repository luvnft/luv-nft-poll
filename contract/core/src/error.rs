use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid fee: {0}")]
    InvalidFee(String),

    #[error("Invalid duration: min {min}, max {max}")]
    InvalidDuration { min: u64, max: u64 },

    #[error("No XION payment provided")]
    NoXionPayment {},

    #[error("Invalid XION payment amount")]
    InvalidFeeAmount {},

    #[error("No contract address in instantiate reply")]
    NoContractAddress {},

    #[error("Failed to instantiate contract")]
    InstantiateFailed {},

    #[error("Unknown reply ID: {id}")]
    UnknownReplyId { id: u64 },

    #[error("Token operation failed")]
    TokenOperationError {},
    
    #[error("Invalid token address")]
    InvalidTokenAddress {},
    
    #[error("Poll already exists")]
    PollAlreadyExists {},
} 