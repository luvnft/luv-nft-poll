use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid duration: must be between {min} and {max} seconds")]
    InvalidDuration { min: u64, max: u64 },

    #[error("Poll already exists")]
    PollExists {},

    #[error("Poll not found")]
    PollNotFound {},

    #[error("Poll already ended")]
    PollEnded {},

    #[error("Poll still active")]
    PollStillActive {},

    #[error("Poll already resolved")]
    PollAlreadyResolved {},

    #[error("Invalid fee amount")]
    InvalidFee {},

    #[error("Invalid protocol fee: cannot exceed {max_fee} basis points")]
    InvalidProtocolFee { max_fee: u64 },

    #[error("Cannot stake zero amount")]
    ZeroStake {},

    #[error("Insufficient allowance")]
    InsufficientAllowance {},

    #[error("Invalid token")]
    InvalidToken {},
}
