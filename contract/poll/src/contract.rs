use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, SubMsg, Uint128
};
use cw2::set_contract_version;

use crate::{
    error::ContractError,
    msg::{
        EpochInfoResponse, ExecuteMsg as PollExecuteMsg, PollInfoResponse, InstantiateMsg as PollInstantiateMsg, QueryMsg as PollQueryMsg,
        UserStakesResponse,
    },
    state::{
        EpochInfo, PollConfig, BATCH_SIZE, CURRENT_EPOCH, EPOCH_DURATION, EPOCHS, EPOCH_STAKERS,
        NUM_EPOCHS, POLL_CONFIG, TOTAL_NO_STAKED, TOTAL_YES_STAKED, USER_STAKES,
    },
};

const CONTRACT_NAME: &str = "crates.io:xion-capypolls-poll";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: PollInstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // let capy_core = deps.api.addr_validate(&msg.capy_core)?;
    // let poll_creator = deps.api.addr_validate(&msg.poll_creator)?;
    // let usde_token = deps.api.addr_validate(&msg.usde_token)?;
    // let susde_token = deps.api.addr_validate(&msg.susde_token)?;
    // let yes_token = deps.api.addr_validate(&msg.yes_token)?;
    // let no_token = deps.api.addr_validate(&msg.no_token)?;

    // Validate addresses and check for empty code
    let capy_core = validate_contract_address(deps.as_ref(), &msg.capy_core)?;
    let poll_creator = deps.api.addr_validate(&msg.poll_creator)
        .map_err(|_| ContractError::InvalidAddress(msg.poll_creator.clone()))?;
    let usde_token = validate_contract_address(deps.as_ref(), &msg.usde_token)?;
    let susde_token = validate_contract_address(deps.as_ref(), &msg.susde_token)?;
    let yes_token = validate_contract_address(deps.as_ref(), &msg.yes_token)?;
    let no_token = validate_contract_address(deps.as_ref(), &msg.no_token)?;

    let config = PollConfig {
        capy_core,
        poll_creator,
        usde_token,
        susde_token,
        yes_token,
        no_token,
        end_timestamp: env.block.time.seconds() + msg.duration,
        total_staked: Uint128::zero(),
        is_resolved: false,
        winning_position: None,
    };

    POLL_CONFIG.save(deps.storage, &config)?;
    TOTAL_YES_STAKED.save(deps.storage, &Uint128::zero())?;
    TOTAL_NO_STAKED.save(deps.storage, &Uint128::zero())?;

    let epoch_duration = msg.duration / 4;
    EPOCH_DURATION.save(deps.storage, &epoch_duration)?;
    NUM_EPOCHS.save(deps.storage, &4u64)?;
    CURRENT_EPOCH.save(deps.storage, &1u64)?;

    // // Initialize first epoch
    // let epoch = EpochInfo {
    //     start_time: env.block.time.seconds(),
    //     end_time: env.block.time.seconds() + epoch_duration,
    //     total_distribution: calculate_epoch_distribution(1),
    //     is_distributed: false,
    //     total_epoch_staked: Uint128::zero(),
    //     last_processed_index: 0,
    // };
    // EPOCHS.save(deps.storage, 1u64, &epoch)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("capy_core", config.capy_core)
        .add_attribute("poll_creator", config.poll_creator)
        .add_attribute("duration", msg.duration.to_string()))
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
    msg: PollExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        PollExecuteMsg::Stake { amount, position } => execute_stake(deps, env, info, amount, position),
        PollExecuteMsg::DistributeEpochRewards { epoch_number } => {
            execute_distribute_epoch_rewards(deps, env, epoch_number)
        }
        PollExecuteMsg::WithdrawStake {} => execute_withdraw_stake(deps, env, info),
        PollExecuteMsg::ResolvePoll { winning_position } => {
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

    // if amount.is_zero() {
    //     return Err(ContractError::ZeroStake {});

    // Check user's USDE balance
    let balance: cw20::BalanceResponse = deps.querier.query_wasm_smart(
        config.usde_token.clone(),
        &cw20::Cw20QueryMsg::Balance {
            address: info.sender.to_string(),
        },
    )?;

    if balance.balance < amount {
        return Err(ContractError::AddressInsufficientBalance(info.sender.to_string()));
    }

    //  // Update current epoch if needed
    //  let mut current_epoch = CURRENT_EPOCH.load(deps.storage)?;

    // Calculate current epoch
    let epoch_duration = EPOCH_DURATION.load(deps.storage)?;

    // let mut epoch = EPOCHS.load(deps.storage, current_epoch)?;

    // if env.block.time.seconds() >= epoch.end_time {
    //     current_epoch += 1;
    //     CURRENT_EPOCH.save(deps.storage, &current_epoch)?;

    let elapsed_time = env.block.time.seconds() - (config.end_timestamp - (epoch_duration * 4));
    let current_epoch = (elapsed_time / epoch_duration) + 1;
    CURRENT_EPOCH.save(deps.storage, &current_epoch)?;


    //     epoch = EpochInfo {
    //         start_time: env.block.time.seconds(),
    //         end_time: env.block.time.seconds() + epoch_duration,
    //         total_distribution: calculate_epoch_distribution(current_epoch),
    //         is_distributed: false,
    //         total_epoch_staked: Uint128::zero(),
    //         last_processed_index: 0,
    //     };
    //     EPOCHS.save(deps.storage, current_epoch, &epoch)?;
    // }

    // // Update stake info

    // Update total staked amounts
    if position {
        // TOTAL_YES_STAKED.update(deps.storage, |total| -> StdResult<_> {
        //     Ok(total + amount)
        // })?;
        let total_yes = TOTAL_YES_STAKED.load(deps.storage)?;
        TOTAL_YES_STAKED.save(deps.storage, &(total_yes + amount))?;
    } else {
        // TOTAL_NO_STAKED.update(deps.storage, |total| -> StdResult<_> {
        //     Ok(total + amount)
        // })?;  
        let total_no = TOTAL_NO_STAKED.load(deps.storage)?;
        TOTAL_NO_STAKED.save(deps.storage, &(total_no + amount))?;
    }

    // POLL_CONFIG.update(deps.storage, |mut config| -> StdResult<_> {
    //     config.total_staked += amount;
    //     Ok(config)
    // })?;

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
    
    // let mut user_stakes = USER_STAKES
    //     .may_load(deps.storage, (&info.sender, current_epoch))?
    //     .unwrap_or_default();
    // user_stakes.push(crate::state::Stake {
    //     amount,
    //     position,
    //     withdrawn: false,
    // });
    // USER_STAKES.save(deps.storage, (&info.sender, current_epoch), &user_stakes)?;

    // EPOCHS.update(deps.storage, current_epoch, |epoch| -> StdResult<_> {
    //     let mut epoch = epoch.unwrap();
    //     epoch.total_epoch_staked += amount;
    //     Ok(epoch)
    // })?;

    // Update epoch info
    let mut epoch = EPOCHS.load(deps.storage, current_epoch)?;
    epoch.total_epoch_staked += amount;
    EPOCHS.save(deps.storage, current_epoch, &epoch)?;

    // Transfer USDE tokens from user to contract
    let transfer_msg = WasmMsg::Execute {
        contract_addr: config.usde_token.to_string(),
        msg: to_binary(&Cw20ExecuteMsg::TransferFrom {
            owner: info.sender.to_string(),
            recipient: env.contract.address.to_string(),
            amount,
        })?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(transfer_msg)
        .add_attribute("action", "stake")
        .add_attribute("user", info.sender)
        .add_attribute("amount", amount)
        .add_attribute("position", position.to_string())
        .add_attribute("epoch", current_epoch.to_string()))
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

    Ok(Response::new().add_submessages(messages))
}

pub fn execute_withdraw_stake(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let config = POLL_CONFIG.load(deps.storage)?;
    if env.block.time.seconds() < config.end_timestamp {
        return Err(ContractError::PollStillActive {});
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

    let transfer_msg = create_mint_msg(&config.usde_token, &info.sender, total_to_withdraw)?;

    Ok(Response::new().add_message(transfer_msg))
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

    let messages = vec![SubMsg::new(create_mint_msg(
        &losing_token,
        &deps.api.addr_validate("public")?,
        Uint128::from(19u128), // For 95% price drop
    )?)];

    Ok(Response::new().add_submessages(messages))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: PollQueryMsg) -> StdResult<Binary> {
    match msg {
        PollQueryMsg::GetEpochInfo { epoch_number } => {
            to_binary(&query_epoch_info(deps, epoch_number)?)
        }
        PollQueryMsg::GetUserStakesForEpoch {
            user,
            epoch_number,
        } => to_binary(&query_user_stakes(deps, user, epoch_number)?),
        PollQueryMsg::GetPollInfo {} => to_binary(&query_poll_info(deps)?),
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
        info: crate::msg::PollInfo {
            end_timestamp: config.end_timestamp,
            yes_token: config.yes_token,
            no_token: config.no_token,
            total_staked: config.total_staked,
            is_resolved: config.is_resolved,
            winning_position: config.winning_position,
        },
    })
}

fn calculate_epoch_distribution(epoch_number: u64) -> Uint128 {
    let distribution = match epoch_number {
        1 => 3657,
        2 => 2743,
        3 => 2058,
        4 => 1542,
        _ => 0u128,
        // _ => 0,
    };
    Uint128::from(distribution)
}

fn create_mint_msg(token: &Addr, recipient: &Addr, amount: Uint128) -> StdResult<CosmosMsg> {
    let msg = cw20::Cw20ExecuteMsg::Mint {
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

fn implement_blitz(deps: DepsMut, env: Env, config: &PollConfig) -> Result<Response, ContractError> {
    let losing_token = if config.winning_position.unwrap() {
        &config.no_token
    } else {
        &config.yes_token
    };

    // Calculate tokens to mint for 95% price drop
    // In Solidity: current_supply * 19 to achieve 95% price drop
    let token_info: TokenInfoResponse = deps.querier.query_wasm_smart(
        losing_token.clone(),
        &Cw20QueryMsg::TokenInfo {},
    )?;

    let current_supply = token_info.total_supply;
    let tokens_to_mint = current_supply.checked_mul(Uint128::from(19u128))
        .map_err(|_| ContractError::FailedInnerCall {})?;

    let messages = vec![SubMsg::new(create_mint_msg(
        losing_token,
        &deps.api.addr_validate("public")?,
        tokens_to_mint,
    )?)];

    Ok(Response::new()
        .add_submessages(messages)
        .add_attribute("action", "implement_blitz")
        .add_attribute("losing_token", losing_token.to_string())
        .add_attribute("minted_amount", tokens_to_mint))
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::coins;

    fn setup_contract() -> (cosmwasm_std::OwnedDeps<_, _, _>, Env) {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "earth"));

        let msg = PollInstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            usde_token: "usde_token".to_string(),
            susde_token: "susde_token".to_string(),
            duration: 1000,
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
        };

        instantiate(deps.as_mut(), env.clone(), info, msg).unwrap();
        (deps, env)
    }

    #[test]
    fn proper_initialization() {
        let (deps, _) = setup_contract();
        
        let config = POLL_CONFIG.load(deps.as_ref().storage).unwrap();
        assert_eq!(config.capy_core, deps.api.addr_validate("capy_core").unwrap());
        assert_eq!(config.poll_creator, deps.api.addr_validate("creator").unwrap());
        assert_eq!(config.usde_token, deps.api.addr_validate("usde_token").unwrap());
        assert_eq!(config.yes_token, deps.api.addr_validate("yes_token").unwrap());
        assert_eq!(config.no_token, deps.api.addr_validate("no_token").unwrap());
        assert!(!config.is_resolved);
        assert_eq!(config.total_staked, Uint128::zero());
    }
}

use cosmwasm_std::{CosmosMsg, WasmMsg}; 