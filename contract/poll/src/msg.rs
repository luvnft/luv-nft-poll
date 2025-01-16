use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub capy_core: String,
    pub poll_creator: String,
    pub usde_token: String,
    pub susde_token: String,
    pub duration: u64,
    pub yes_token: String,
    pub no_token: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    Stake {
        amount: Uint128,
        position: bool,
    },
    DistributeEpochRewards {
        epoch_number: u64,
    },
    WithdrawStake {},
    ResolvePoll {
        winning_position: bool,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(EpochInfoResponse)]
    GetEpochInfo { epoch_number: u64 },
    #[returns(UserStakesResponse)]
    GetUserStakesForEpoch { user: String, epoch_number: u64 },
    #[returns(PollInfoResponse)]
    GetPollInfo {},
}

#[cw_serde]
pub struct EpochInfoResponse {
    pub start_time: u64,
    pub end_time: u64,
    pub total_distribution: Uint128,
    pub is_distributed: bool,
    pub num_stakers: u64,
}

#[cw_serde]
pub struct UserStakesResponse {
    pub stakes: Vec<crate::state::Stake>,
}

#[cw_serde]
pub struct PollInfo {
    pub end_timestamp: u64,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub total_staked: Uint128,
    pub is_resolved: bool,
    pub winning_position: Option<bool>,
}

#[cw_serde]
pub struct PollInfoResponse {
    pub info: PollInfo,
} 