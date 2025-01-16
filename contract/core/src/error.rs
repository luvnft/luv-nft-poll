use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid duration: must be between {min} and {max}")]
    InvalidDuration { min: u64, max: u64 },

    #[error("Empty question")]
    EmptyQuestion {},

    #[error("Empty token names")]
    EmptyTokenNames {},

    #[error("Empty token symbols")]
    EmptyTokenSymbols {},

    #[error("Invalid fee: {0}")]
    InvalidFee(String),

    #[error("Invalid address: {0}")]
    InvalidAddress(String),

    #[error("Unknown reply id: {id}")]
    UnknownReplyId { id: u64 },

    #[error("No contract address in reply")]
    NoContractAddress {},

    #[error("Invalid instantiation")]
    InvalidInstantiation {},
} 