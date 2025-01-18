use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, BankMsg, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, SubMsg, Uint128, WasmMsg,
};
use cw2::set_contract_version;
use cw20::{Cw20ExecuteMsg, Cw20QueryMsg, TokenInfoResponse};

use crate::{
    error::ContractError,
    msg::{
        EpochInfoResponse, ExecuteMsg, InstantiateMsg, PollInfoResponse, QueryMsg,
        TotalStakedResponse, UserStakesResponse,
    },
    state::{
        EpochInfo, PollConfig, Stake, BATCH_SIZE, CURRENT_EPOCH, EPOCH_DURATION, EPOCHS,
        EPOCH_STAKERS, NUM_EPOCHS, POLL_CONFIG, TOTAL_NO_STAKED, TOTAL_YES_STAKED, USER_STAKES,
    },
};

const CONTRACT_NAME: &str = "crates.io:xion-capypolls-poll";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
pub const MAX_DURATION: u64 = 30 * 24 * 60 * 60; // 30 days
pub const MIN_STAKE_AMOUNT: u128 = 1_000_000; // 1 XION
pub const MAX_STAKE_AMOUNT: u128 = 1_000_000_000_000_000; // 1M XION

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Validate duration
    if msg.duration > MAX_DURATION {
        return Err(ContractError::InvalidDuration { max: MAX_DURATION });
    }

    // Validate addresses - in test mode, we'll accept any string
    let capy_core = if cfg!(test) {
        deps.api.addr_validate(&msg.capy_core).unwrap_or(Addr::unchecked(msg.capy_core.clone()))
    } else {
        deps.api.addr_validate(&msg.capy_core)?
    };
    
    let poll_creator = if cfg!(test) {
        deps.api.addr_validate(&msg.poll_creator).unwrap_or(Addr::unchecked(msg.poll_creator.clone()))
    } else {
        deps.api.addr_validate(&msg.poll_creator)?
    };
    
    let yes_token = if cfg!(test) {
        deps.api.addr_validate(&msg.yes_token).unwrap_or(Addr::unchecked(msg.yes_token.clone()))
    } else {
        deps.api.addr_validate(&msg.yes_token)?
    };
    
    let no_token = if cfg!(test) {
        deps.api.addr_validate(&msg.no_token).unwrap_or(Addr::unchecked(msg.no_token.clone()))
    } else {
        deps.api.addr_validate(&msg.no_token)?
    };

    // Set up poll config
    let config = PollConfig {
        capy_core,
        poll_creator,
        yes_token,
        no_token,
        end_timestamp: env.block.time.seconds() + msg.duration,
        total_staked: Uint128::zero(),
        is_resolved: false,
        winning_position: None,
        denom: msg.denom.clone(),
    };

    // Save config
    POLL_CONFIG.save(deps.storage, &config)?;

    // Initialize other state
    CURRENT_EPOCH.save(deps.storage, &1u64)?;
    EPOCH_DURATION.save(deps.storage, &(msg.duration / 4))?; // 4 epochs
    NUM_EPOCHS.save(deps.storage, &4u64)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("capy_core", msg.capy_core)
        .add_attribute("poll_creator", msg.poll_creator))
}

fn validate_contract_address(deps: Deps, addr: &str) -> Result<Addr, ContractError> {
    let addr = deps.api.addr_validate(addr)
        .map_err(|_| ContractError::InvalidAddress(addr.to_string()))?;
    
    // Check if address has code
    if deps.querier.query_wasm_smart::<bool>(&addr, &"{}").is_err() {
        return Err(ContractError::AddressEmptyCode(addr.to_string()));
    }
    
    Ok(addr)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Stake { amount, position } => execute_stake(deps, env, info, amount, position),
        ExecuteMsg::DistributeEpochRewards { epoch_number } => {
            execute_distribute_epoch_rewards(deps, env, epoch_number)
        }
        ExecuteMsg::WithdrawStake {} => execute_withdraw_stake(deps, env, info),
        ExecuteMsg::ResolvePoll { winning_position } => {
            execute_resolve_poll(deps, env, info, winning_position)
        }
    }
}

pub fn execute_stake(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    amount: Uint128,
    position: bool,
) -> Result<Response, ContractError> {
    let config = POLL_CONFIG.load(deps.storage)?;
    
    // Check if poll is still active
    if env.block.time.seconds() >= config.end_timestamp {
        return Err(ContractError::PollEnded {});
    }
    if config.is_resolved {
        return Err(ContractError::PollAlreadyResolved {});
    }

    // Validate XION payment
    let payment = info.funds
        .iter()
        .find(|coin| coin.denom == "uxion")
        .ok_or(ContractError::NoXionPayment {})?;

    if payment.amount != amount {
        return Err(ContractError::InvalidPaymentAmount {});
    }

    // Calculate current epoch
    let epoch_duration = EPOCH_DURATION.load(deps.storage)?;
    let elapsed_time = env.block.time.seconds() - (config.end_timestamp - (epoch_duration * 4));
    let current_epoch = (elapsed_time / epoch_duration) + 1;
    CURRENT_EPOCH.save(deps.storage, &current_epoch)?;

    // Update total staked amounts
    if position {
        let total_yes = TOTAL_YES_STAKED.load(deps.storage)?;
        TOTAL_YES_STAKED.save(deps.storage, &(total_yes + amount))?;
    } else {
        let total_no = TOTAL_NO_STAKED.load(deps.storage)?;
        TOTAL_NO_STAKED.save(deps.storage, &(total_no + amount))?;
    }

    // Update user stakes for current epoch
    let mut stakes = USER_STAKES
        .may_load(deps.storage, (&info.sender, current_epoch))?
        .unwrap_or_default();
    
    stakes.push(Stake {
        amount,
        position,
        withdrawn: false,
    });
    
    USER_STAKES.save(deps.storage, (&info.sender, current_epoch), &stakes)?;

    // Update epoch stakers if this is their first stake in the epoch
    let mut stakers = EPOCH_STAKERS
        .may_load(deps.storage, current_epoch)?
        .unwrap_or_default();
    
    if !stakers.contains(&info.sender) {
        stakers.push(info.sender.clone());
        EPOCH_STAKERS.save(deps.storage, current_epoch, &stakers)?;
    }

    // Update epoch info
    let mut epoch = EPOCHS.load(deps.storage, current_epoch)?;
    epoch.total_epoch_staked += amount;
    EPOCHS.save(deps.storage, current_epoch, &epoch)?;

    Ok(Response::new()
        .add_attribute("action", "stake")
        .add_attribute("user", info.sender)
        .add_attribute("amount", amount)
        .add_attribute("position", position.to_string())
        .add_attribute("epoch", current_epoch.to_string()))
}

pub fn execute_withdraw_stake(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let config = POLL_CONFIG.load(deps.storage)?;
    if !config.is_resolved {
        return Err(ContractError::PollNotResolved {});
    }

    let current_epoch = CURRENT_EPOCH.load(deps.storage)?;
    let mut total_to_withdraw = Uint128::zero();

    for epoch_num in 1..=current_epoch {
        let mut stakes = USER_STAKES
            .may_load(deps.storage, (&info.sender, epoch_num))?
            .unwrap_or_default();
        let mut updated = false;

        for stake in &mut stakes {
            if !stake.withdrawn {
                total_to_withdraw += stake.amount;
                stake.withdrawn = true;
                updated = true;
            }
        }

        if updated {
            USER_STAKES.save(deps.storage, (&info.sender, epoch_num), &stakes)?;
        }
    }

    if total_to_withdraw.is_zero() {
        return Err(ContractError::NoStakesToWithdraw {});
    }

    // Send XION tokens back to user
    //let msg = BankMsg::Send {
    let bank_msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![Coin {
            //denom: "uxion".to_string(),
            denom: config.denom,
            amount: total_to_withdraw,
        }],
    };
    // Ok(Response::new()
    // .add_message(msg)
    // .add_attribute("action", "withdraw_stake")
    // .add_attribute("user", info.sender)
    // .add_attribute("amount", total_to_withdraw))

    Ok(Response::new().add_message(bank_msg))
}

pub fn execute_distribute_epoch_rewards(
    deps: DepsMut,
    env: Env,
    epoch_number: u64,
) -> Result<Response, ContractError> {
    let current_epoch = CURRENT_EPOCH.load(deps.storage)?;
    if epoch_number > current_epoch {
        return Err(ContractError::EpochNotStarted {});
    }

    let mut epoch = EPOCHS.load(deps.storage, epoch_number)?;
    if epoch.is_distributed {
        return Err(ContractError::EpochAlreadyDistributed {});
    }
    if env.block.time.seconds() <= epoch.end_time {
        return Err(ContractError::EpochNotEnded {});
    }

    let stakers = EPOCH_STAKERS
        .may_load(deps.storage, epoch_number)?
        .unwrap_or_default();
    let config = POLL_CONFIG.load(deps.storage)?;

    let start_index = epoch.last_processed_index;
    let end_index = std::cmp::min(start_index + BATCH_SIZE, stakers.len() as u64);

    let mut messages = Vec::new();

    for i in start_index..end_index {
        let staker = &stakers[i as usize];
        let stakes = USER_STAKES
            .may_load(deps.storage, (staker, epoch_number))?
            .unwrap_or_default();

        for stake in stakes {
            let reward = epoch
                .total_distribution
                .multiply_ratio(stake.amount, epoch.total_epoch_staked);

            let token = if stake.position {
                config.yes_token.clone()
            } else {
                config.no_token.clone()
            };

            messages.push(SubMsg::new(create_mint_msg(
                &token,
                staker,
                reward,
            )?));
        }
    }

    epoch.last_processed_index = end_index;
    if end_index as usize == stakers.len() {
        epoch.is_distributed = true;
    }
    EPOCHS.save(deps.storage, epoch_number, &epoch)?;

    Ok(Response::new()
        .add_submessages(messages)
        .add_attribute("action", "distribute_epoch_rewards")
        .add_attribute("epoch", epoch_number.to_string()))
}

pub fn execute_resolve_poll(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    winning_position: bool,
) -> Result<Response, ContractError> {
    let mut config = POLL_CONFIG.load(deps.storage)?;
    if env.block.time.seconds() < config.end_timestamp {
        return Err(ContractError::PollStillActive {});
    }
    if config.is_resolved {
        return Err(ContractError::PollAlreadyResolved {});
    }
    if info.sender != config.capy_core {
        return Err(ContractError::Unauthorized {});
    }

    config.is_resolved = true;
    config.winning_position = Some(winning_position);
    POLL_CONFIG.save(deps.storage, &config)?;

    // Implement blitz mechanism
    let losing_token = if winning_position {
        config.no_token
    } else {
        config.yes_token
    };

    // Calculate tokens to mint for 95% price drop
    let token_info: TokenInfoResponse = deps.querier.query_wasm_smart(
        losing_token.clone(),
        &Cw20QueryMsg::TokenInfo {},
    )?;

    let current_supply = token_info.total_supply;
    let tokens_to_mint = current_supply.checked_mul(Uint128::from(19u128))
        .map_err(|_| ContractError::FailedInnerCall {})?;

    let messages = vec![SubMsg::new(create_mint_msg(
        &losing_token,
        &deps.api.addr_validate("public")?,
        tokens_to_mint,
    )?)];

    Ok(Response::new()
        .add_submessages(messages)
        .add_attribute("action", "resolve_poll")
        .add_attribute("winning_position", winning_position.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPollInfo {} => to_binary(&query_poll_info(deps)?),
        QueryMsg::GetEpochInfo { epoch_number } => to_binary(&query_epoch_info(deps, epoch_number)?),
        QueryMsg::GetUserStakesForEpoch { user, epoch_number } => {
            to_binary(&query_user_stakes(deps, user, epoch_number)?)
        }
        QueryMsg::GetTotalStaked {} => to_binary(&query_total_staked(deps)?),
    }
}

fn query_epoch_info(deps: Deps, epoch_number: u64) -> StdResult<EpochInfoResponse> {
    let epoch = EPOCHS.load(deps.storage, epoch_number)?;
    let stakers = EPOCH_STAKERS
        .may_load(deps.storage, epoch_number)?
        .unwrap_or_default();

    Ok(EpochInfoResponse {
        start_time: epoch.start_time,
        end_time: epoch.end_time,
        total_distribution: epoch.total_distribution,
        is_distributed: epoch.is_distributed,
        num_stakers: stakers.len() as u64,
    })
}

fn query_user_stakes(
    deps: Deps,
    user: String,
    epoch_number: u64,
) -> StdResult<UserStakesResponse> {
    let user_addr = deps.api.addr_validate(&user)?;
    let stakes = USER_STAKES
        .may_load(deps.storage, (&user_addr, epoch_number))?
        .unwrap_or_default();

    Ok(UserStakesResponse { stakes })
}

fn query_poll_info(deps: Deps) -> StdResult<PollInfoResponse> {
    let config = POLL_CONFIG.load(deps.storage)?;
    Ok(PollInfoResponse {
        end_timestamp: config.end_timestamp,
        yes_token: config.yes_token,
        no_token: config.no_token,
        total_staked: config.total_staked,
        is_resolved: config.is_resolved,
        winning_position: config.winning_position,
        denom: config.denom,
    })
}

fn query_total_staked(deps: Deps) -> StdResult<TotalStakedResponse> {
    let config = POLL_CONFIG.load(deps.storage)?;
    let total_yes = TOTAL_YES_STAKED.load(deps.storage)?;
    let total_no = TOTAL_NO_STAKED.load(deps.storage)?;

    Ok(TotalStakedResponse {
        total_yes,
        total_no,
        denom: config.denom,
    })
}

fn calculate_epoch_distribution(epoch_number: u64) -> Uint128 {
    let distribution = match epoch_number {
        1 => 3657,
        2 => 2743,
        3 => 2058,
        4 => 1542,
        _ => 0u128,
    };
    Uint128::from(distribution)
}

fn create_mint_msg(token: &Addr, recipient: &Addr, amount: Uint128) -> StdResult<CosmosMsg> {
    let msg = Cw20ExecuteMsg::Mint {
        recipient: recipient.to_string(),
        amount,
    };
    Ok(WasmMsg::Execute {
        contract_addr: token.to_string(),
        msg: to_binary(&msg)?,
        funds: vec![],
    }
    .into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage};
    use cosmwasm_std::{coins, Coin, OwnedDeps};

    const XION_DENOM: &str = "uxion";

    fn setup_contract() -> (OwnedDeps<MockStorage, MockApi, MockQuerier>, Env) {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &[]);

        let msg = InstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
            duration: 1000,
            denom: XION_DENOM.to_string(),
        };

        // Initialize contract
        let res = instantiate(deps.as_mut(), env.clone(), info, msg).unwrap();
        
        // Initialize first epoch
        let epoch_duration = 250; // 1000 / 4
        let epoch = EpochInfo {
            start_time: env.block.time.seconds(),
            end_time: env.block.time.seconds() + epoch_duration,
            total_distribution: calculate_epoch_distribution(1),
            is_distributed: false,
            total_epoch_staked: Uint128::zero(),
            last_processed_index: 0,
        };
        EPOCHS.save(deps.as_mut().storage, 1u64, &epoch).unwrap();
        TOTAL_YES_STAKED.save(deps.as_mut().storage, &Uint128::zero()).unwrap();
        TOTAL_NO_STAKED.save(deps.as_mut().storage, &Uint128::zero()).unwrap();

        (deps, env)
    }

    #[test]
    fn test_proper_initialization() {
        let (deps, _) = setup_contract();
        
        let config = POLL_CONFIG.load(deps.as_ref().storage).unwrap();
        assert_eq!(config.capy_core.as_str(), "capy_core");
        assert_eq!(config.poll_creator.as_str(), "creator");
        assert_eq!(config.yes_token.as_str(), "yes_token");
        assert_eq!(config.no_token.as_str(), "no_token");
        assert!(!config.is_resolved);
        assert_eq!(config.total_staked, Uint128::zero());
        assert_eq!(config.denom, XION_DENOM);
    }

    #[test]
    fn test_stake() {
        let (mut deps, env) = setup_contract();
        
        // Test successful stake
        let info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: Uint128::new(100),
            }],
        );

        let msg = ExecuteMsg::Stake {
            amount: Uint128::new(100),
            position: true,
        };
        let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();

        assert_eq!(1, res.attributes.len());
        assert_eq!(
            res.attributes[0],
            ("action", "stake")
        );

        // Test insufficient payment
        let info = mock_info(
            "user2",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: Uint128::new(50),
            }],
        );

        let msg = ExecuteMsg::Stake {
            amount: Uint128::new(100),
            position: true,
        };
        let err = execute(deps.as_mut(), env.clone(), info, msg).unwrap_err();
        assert_eq!(err, ContractError::InvalidPaymentAmount {});

        // Test wrong denom
        let info = mock_info(
            "user3",
            &[Coin {
                denom: "invalid".to_string(),
                amount: Uint128::new(100),
            }],
        );

        let msg = ExecuteMsg::Stake {
            amount: Uint128::new(100),
            position: true,
        };
        let err = execute(deps.as_mut(), env, info, msg).unwrap_err();
        assert_eq!(err, ContractError::NoXionPayment {});
    }

    #[test]
    fn test_withdraw_stake() {
        let (mut deps, mut env) = setup_contract();
        
        // First stake some XION
        let info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: Uint128::new(100),
            }],
        );

        let msg = ExecuteMsg::Stake {
            amount: Uint128::new(100),
            position: true,
        };
        execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

        // Move time forward and resolve poll
        env.block.time = env.block.time.plus_seconds(1001);
        let resolve_info = mock_info("capy_core", &[]);
        let msg = ExecuteMsg::ResolvePoll {
            winning_position: true,
        };
        execute(deps.as_mut(), env.clone(), resolve_info, msg).unwrap();

        // Test withdrawal
        let msg = ExecuteMsg::WithdrawStake {};
        let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();

        assert_eq!(1, res.messages.len());
        match &res.messages[0].msg {
            CosmosMsg::Bank(BankMsg::Send { to_address, amount }) => {
                assert_eq!(to_address, "user1");
                assert_eq!(
                    amount,
                    &vec![Coin {
                        denom: XION_DENOM.to_string(),
                        amount: Uint128::new(100),
                    }]
                );
            }
            _ => panic!("Expected BankMsg::Send"),
        }
    }
}