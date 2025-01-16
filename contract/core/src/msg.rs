use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {
    pub usde_token: String,
    pub susde_token: String,
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
    // UpdateCloneablePollAddress {
    //     address: String,
    UpdatePollCodeId {
        code_id: u64,
    },
    // UpdateCloneableTokenAddress {
    //     address: String,
    UpdateTokenCodeId {
        code_id: u64,
    },
    UpdateUsdeTokenAddress {
        address: String,
    },
    UpdateSusdeTokenAddress {
        address: String,
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
}

#[cw_serde]
pub struct ConfigResponse {
    pub owner: String,
    pub usde_token: String,
    pub susde_token: String,
    pub initial_fee: Uint128,
    pub protocol_fee: u64,
    pub max_protocol_fee: u64,
    pub poll_code_id: u64,
    pub token_code_id: u64,
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