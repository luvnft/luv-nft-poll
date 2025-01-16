use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
// use schemars::JsonSchema;
// use serde::{Deserialize, Serialize};

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
    pub poll_addr: Addr,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub question: String,
    pub avatar: String,
    pub description: String,
}

//pub const STATE: Item<State> = Item::new("state");
pub const CONFIG: Item<Config> = Item::new("config");
pub const POLLS: Map<&Addr, Poll> = Map::new("polls");
pub const POLL_LIST: Item<Vec<Addr>> = Item::new("poll_list");
