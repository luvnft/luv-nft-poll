use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub poll_code_id: u64,
    pub token_code_id: u64,
    pub usde_token: String,
    pub susde_token: String,
    pub initial_fee: Uint128,
    pub protocol_fee: u64, // basis points (e.g., 100 = 1%)
}

#[cw_serde]
pub enum ExecuteMsg {
    CreatePoll {
        question: String,
        avatar: String,
        description: String,
        duration: u64,
        yes_token_name: String,
        yes_token_symbol: String,
        no_token_name: String,
        no_token_symbol: String,
    },
    UpdateConfig {
        poll_code_id: Option<u64>,
        token_code_id: Option<u64>,
        initial_fee: Option<Uint128>,
        protocol_fee: Option<u64>,
    },
    WithdrawFees {
        to: String,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(PollResponse)]
    Poll { address: String },
    #[returns(PollsResponse)]
    Polls { 
        start_after: Option<String>, 
        limit: Option<u32> 
    },
}

#[cw_serde]
pub struct ConfigResponse {
    pub owner: Addr,
    pub poll_code_id: u64,
    pub token_code_id: u64,
    pub usde_token: Addr,
    pub susde_token: Addr,
    pub initial_fee: Uint128,
    pub protocol_fee: u64,
}

#[cw_serde]
pub struct PollResponse {
    pub exists: bool,
    pub description: Option<String>,
    pub yes_token: Option<Addr>,
    pub no_token: Option<Addr>,
    pub end_timestamp: Option<u64>,
    pub total_staked: Option<Uint128>,
}

#[cw_serde]
pub struct PollsResponse {
    pub polls: Vec<PollDetail>,
}

#[cw_serde]
pub struct PollDetail {
    pub address: Addr,
    pub description: String,
    pub yes_token: Addr,
    pub no_token: Addr,
}
