use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct PollConfig {
    pub capy_core: Addr,
    pub poll_creator: Addr,
    pub usde_token: Addr,
    pub susde_token: Addr,
    pub yes_token: Addr,
    pub no_token: Addr,
    pub end_timestamp: u64,
    pub total_staked: Uint128,
    pub is_resolved: bool,
    pub winning_position: Option<bool>,
}

#[cw_serde]
pub struct EpochInfo {
    pub start_time: u64,
    pub end_time: u64,
    pub total_distribution: Uint128,
    pub is_distributed: bool,
    pub total_epoch_staked: Uint128,
    pub last_processed_index: u64,
}

#[cw_serde]
pub struct Stake {
    pub amount: Uint128,
    pub position: bool,
    pub withdrawn: bool,
}

pub const POLL_CONFIG: Item<PollConfig> = Item::new("poll_config");
pub const EPOCHS: Map<u64, EpochInfo> = Map::new("epochs");
pub const CURRENT_EPOCH: Item<u64> = Item::new("current_epoch");
pub const TOTAL_YES_STAKED: Item<Uint128> = Item::new("total_yes_staked");
pub const TOTAL_NO_STAKED: Item<Uint128> = Item::new("total_no_staked");
pub const EPOCH_DURATION: Item<u64> = Item::new("epoch_duration");
pub const NUM_EPOCHS: Item<u64> = Item::new("num_epochs");
pub const USER_STAKES: Map<(&Addr, u64), Vec<Stake>> = Map::new("user_stakes");
pub const EPOCH_STAKERS: Map<u64, Vec<Addr>> = Map::new("epoch_stakers");

// Constants
pub const MAX_TOKEN_SUPPLY: u128 = 1_000_000_000 * 10u128.pow(18);
pub const CREATOR_REWARD_PERCENTAGE: u64 = 100; // 1%
pub const DISTRIBUTION_PERCENTAGE: u64 = 6900; // 69%
pub const PAID_LIST_PERCENTAGE: u64 = 3000; // 30%
pub const BATCH_SIZE: u64 = 100;

pub const EPOCH_1_DISTRIBUTION: u64 = 3657;
pub const EPOCH_2_DISTRIBUTION: u64 = 2743;
pub const EPOCH_3_DISTRIBUTION: u64 = 2058;
pub const EPOCH_4_DISTRIBUTION: u64 = 1542; 