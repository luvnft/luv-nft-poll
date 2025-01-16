use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Timestamp, Uint128};
use cw_storage_plus::{Item, Map};
// use schemars::JsonSchema;
// use serde::{Deserialize, Serialize};


// CapyCore state
#[cw_serde]
pub struct Config {
    pub owner: Addr,
    pub usde_token: Addr,
    pub susde_token: Addr,
    pub poll_code_id: u64,
    pub token_code_id: u64,
    pub initial_fee: Uint128,
    pub protocol_fee: u64,  // in basis points (e.g. 100 = 1%)
}

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
// pub struct State {
//     pub count: i32,
//     pub owner: Addr,

#[cw_serde]
pub struct Poll {
    pub creator: Addr,
    pub question: String,
    pub avatar: String,
    pub description: String,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub end_timestamp: Timestamp,
    //pub poll_addr: Addr,
}

// CapyPoll state
#[cw_serde]
pub struct PollInfo {
    pub end_timestamp: Timestamp,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub total_staked: Uint128,
    pub is_resolved: bool,
    pub winning_position: Option<bool>,
}

#[cw_serde]
pub struct Stake {
    pub amount: Uint128,
    pub position: bool,  // true for YES, false for NO
    pub withdrawn: bool,
}

#[cw_serde]
pub struct EpochInfo {
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub total_distribution: Uint128,
    pub is_distributed: bool,
    pub total_epoch_staked: Uint128,
    pub last_processed_index: u64,
    pub stakers: Vec<Addr>,
}

// Constants
pub const MAX_TOKEN_SUPPLY: u128 = 1_000_000_000 * 10u128.pow(18);
pub const CREATOR_REWARD_PERCENTAGE: u64 = 100;  // 1%
pub const DISTRIBUTION_PERCENTAGE: u64 = 6900;   // 69%
pub const PAID_LIST_PERCENTAGE: u64 = 3000;      // 30%
pub const BATCH_SIZE: u64 = 100;

pub const EPOCH_1_DISTRIBUTION: u64 = 3657;
pub const EPOCH_2_DISTRIBUTION: u64 = 2743;
pub const EPOCH_3_DISTRIBUTION: u64 = 2058;
pub const EPOCH_4_DISTRIBUTION: u64 = 1542;

// Storage items
pub const CONFIG: Item<Config> = Item::new("config");
pub const POLLS: Map<&Addr, Poll> = Map::new("polls");
pub const POLL_LIST: Item<Vec<Addr>> = Item::new("poll_list");
pub const POLL_INFO: Item<PollInfo> = Item::new("poll_info");
pub const EPOCHS: Map<u64, EpochInfo> = Map::new("epochs");
pub const CURRENT_EPOCH: Item<u64> = Item::new("current_epoch");
pub const TOTAL_YES_STAKED: Item<Uint128> = Item::new("total_yes_staked");
pub const TOTAL_NO_STAKED: Item<Uint128> = Item::new("total_no_staked");
pub const USER_STAKES: Map<(&Addr, u64), Vec<Stake>> = Map::new("user_stakes");
