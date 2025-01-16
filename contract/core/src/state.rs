use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub owner: Addr,
    pub usde_token: Addr,
    pub susde_token: Addr,
    pub initial_fee: Uint128,
    pub protocol_fee: u64,
    pub max_protocol_fee: u64,
    pub poll_code_id: u64,
    pub token_code_id: u64,
}

#[cw_serde]
pub struct PollInfo {
    pub creator: Addr,
    pub question: String,
    pub avatar: String,
    pub description: String,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub poll_addr: Addr,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const POLLS: Map<&Addr, PollInfo> = Map::new("polls");
pub const POLL_COUNT: Item<u64> = Item::new("poll_count");
pub const POLL_SEQUENCE: Map<u64, Addr> = Map::new("poll_sequence");
pub const TEMP_POLL_DATA: Item<TempPollData> = Item::new("temp_poll_data");

#[cw_serde]
pub struct TempPollData {
    pub creator: Addr,
    pub question: String,
    pub avatar: String,
    pub description: String,
    pub yes_token: Option<Addr>,
    pub no_token: Option<Addr>,
    pub poll_addr: Option<Addr>,
    pub duration: u64,
} 