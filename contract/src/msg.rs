use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub poll_code_id: u64,
    pub token_code_id: u64,
    pub usde_token: String,
    pub susde_token: String,
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
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    //  // GetCount returns the current count as a json-encoded number
    //  #[returns(GetCountResponse)]
    //  GetCount {},
    #[returns(ConfigResponse)]
    Config {},
    #[returns(PollResponse)]
    Poll { address: String },
    #[returns(PollsResponse)]
    Polls { start_after: Option<String>, limit: Option<u32> },
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCountResponse {
    pub count: i32,
}
