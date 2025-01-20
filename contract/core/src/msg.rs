use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;
use cosmwasm_std::Addr;

use crate::state::MarketStats;

#[cw_serde]
pub struct InstantiateMsg {
    pub initial_fee: Uint128,
    pub protocol_fee: u64,
    pub poll_code_id: u64,
    pub token_code_id: u64,
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
    UpdatePollCodeId {
        code_id: u64,
    },
    UpdateTokenCodeId {
        code_id: u64,
    },
    SetInitialFee {
        new_fee: Uint128,
    },
    SetProtocolFee {
        new_fee: u64,
    },
    WithdrawFees {
        to: String,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    GetConfig {},
    #[returns(PollCountResponse)]
    GetPollCount {},
    #[returns(PollResponse)]
    GetPollAt { index: u64 },
    #[returns(bool)]
    IsPollFromFactory { poll_address: String },
    #[returns(PollDetailsResponse)]
    GetPollDetails { poll_address: String },
    #[returns(MarketStats)]
    GetMarketStats {},
    #[returns(Vec<PollResponse>)]
    ListActivePolls {
        start_after: Option<String>,
        limit: Option<u32>,
    },
}

#[cw_serde]
pub struct ConfigResponse {
    pub owner: String,
    pub initial_fee: Uint128,
    pub protocol_fee: u64,
    pub poll_code_id: u64,
    pub token_code_id: u64,
    pub denom: String,
}

#[cw_serde]
pub struct PollCountResponse {
    pub count: u64,
}

#[cw_serde]
pub struct PollResponse {
    pub address: String,
}

#[cw_serde]
pub struct PollDetailsResponse {
    pub exists: bool,
    pub description: Option<String>,
} 