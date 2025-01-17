use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Reply, Response, StdResult, SubMsg,
    Uint128, WasmMsg,
};
use cw2::set_contract_version;
use cw20::Cw20ExecuteMsg;

use crate::{
    error::ContractError,
    msg::{
        ConfigResponse, ExecuteMsg, InstantiateMsg, PollCountResponse, PollDetailsResponse, PollResponse,
        QueryMsg,
    },
    state::{Config, PollInfo, TempPollData, CONFIG, POLLS, POLL_COUNT, POLL_SEQUENCE, TEMP_POLL_DATA},
};

const CONTRACT_NAME: &str = "crates.io:xion-capyflows-core";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

const MIN_DURATION: u64 = 60; // 1 minute
const MAX_DURATION: u64 = 2592000; // 30 days
const MAX_PROTOCOL_FEE: u64 = 1000; // 10%

// Reply IDs
const REPLY_YES_TOKEN_INIT: u64 = 1;
const REPLY_NO_TOKEN_INIT: u64 = 2;
const REPLY_POLL_INIT: u64 = 3;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let usde_token = deps.api.addr_validate(&msg.usde_token)?;
    let susde_token = deps.api.addr_validate(&msg.susde_token)?;

    let config = Config {
        owner: info.sender.clone(),
        usde_token,
        susde_token,
        initial_fee: msg.initial_fee,
        protocol_fee: msg.protocol_fee,
        max_protocol_fee: MAX_PROTOCOL_FEE,
        poll_code_id: msg.poll_code_id,
        token_code_id: msg.token_code_id,
    };

    CONFIG.save(deps.storage, &config)?;
    POLL_COUNT.save(deps.storage, &0u64)?;

    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreatePoll {
            question,
            avatar,
            description,
            duration,
            yes_token_name,
            yes_token_symbol,
            no_token_name,
            no_token_symbol,
        } => execute_create_poll(
            deps,
            env,
            info,
            question,
            avatar,
            description,
            duration,
            yes_token_name,
            yes_token_symbol,
            no_token_name,
            no_token_symbol,
        ),
        // ExecuteMsg::UpdateCloneablePollAddress { address } => {
        //     execute_update_cloneable_poll_address(deps, info, address)
        ExecuteMsg::UpdatePollCodeId { code_id } => {
            execute_update_poll_code_id(deps, info, code_id)
        }
        //ExecuteMsg::UpdateCloneableTokenAddress { address } => {
        //  execute_update_cloneable_token_address(deps, info, address)
        ExecuteMsg::UpdateTokenCodeId { code_id } => {
            execute_update_token_code_id(deps, info, code_id)
        }
        ExecuteMsg::UpdateUsdeTokenAddress { address } => {
            execute_update_usde_token_address(deps, info, address)
        }
        ExecuteMsg::UpdateSusdeTokenAddress { address } => {
            execute_update_susde_token_address(deps, info, address)
        }
        ExecuteMsg::SetInitialFee { new_fee } => execute_set_initial_fee(deps, info, new_fee),
        ExecuteMsg::SetProtocolFee { new_fee } => execute_set_protocol_fee(deps, info, new_fee),
        ExecuteMsg::WithdrawFees { to } => execute_withdraw_fees(deps, env, info, to),
    }
}

pub fn execute_create_poll(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    question: String,
    avatar: String,
    description: String,
    duration: u64,
    yes_token_name: String,
    yes_token_symbol: String,
    no_token_name: String,
    no_token_symbol: String,
) -> Result<Response, ContractError> {
    if question.is_empty() {
        return Err(ContractError::EmptyQuestion {});
    }
    if yes_token_name.is_empty() || no_token_name.is_empty() {
        return Err(ContractError::EmptyTokenNames {});
    }
    if yes_token_symbol.is_empty() || no_token_symbol.is_empty() {
        return Err(ContractError::EmptyTokenSymbols {});
    }
    if duration < MIN_DURATION || duration > MAX_DURATION {
        return Err(ContractError::InvalidDuration {
            min: MIN_DURATION,
            max: MAX_DURATION,
        });
    }

    let config = CONFIG.load(deps.storage)?;

    // let poll_count = POLL_COUNT.load(deps.storage)?;
    // let next_poll_count = poll_count + 1;
    
    // Collect initial fee
    let transfer_msg = WasmMsg::Execute {
        contract_addr: config.usde_token.to_string(),
        msg: to_binary(&Cw20ExecuteMsg::TransferFrom {
            owner: info.sender.to_string(),
            recipient: env.contract.address.to_string(),
            amount: config.initial_fee,
        })?,
        funds: vec![],
    };

    // Save temporary data for reply handler
    let temp_data = TempPollData {
        creator: info.sender.clone(),
        question: question.clone(),
        avatar,
        description,
        yes_token: None,
        no_token: None,
        poll_addr: None,
        duration,
    };
    TEMP_POLL_DATA.save(deps.storage, &temp_data)?;

    // Create YES token
    let yes_token_init = cw20_base::msg::InstantiateMsg {
        // name: yes_token_name,
        // symbol: yes_token_symbol,
        name: yes_token_name.clone(),
        symbol: yes_token_symbol.clone(),
        decimals: 18,
        initial_balances: vec![],
        mint: Some(cw20::MinterResponse {
            minter: info.sender.to_string(),
            cap: None,
        }),
        marketing: None,
    };
     // let no_token_instantiate = SubMsg::new(WasmMsg::Instantiate {
    //     admin: Some(info.sender.to_string()),
    //     code_id: 1, // TODO: Get from config
    //     msg: to_binary(&no_token_init)?,
    //     funds: vec![],
    //     label: format!("NO Token for Poll {}", next_poll_count),
    // });
    let yes_token_instantiate = SubMsg::reply_on_success(
        WasmMsg::Instantiate {
            admin: Some(info.sender.to_string()),
            code_id: config.token_code_id,
            msg: to_binary(&yes_token_init)?,
            funds: vec![],
            label: format!("YES Token for Poll {}", question),
        },
        REPLY_YES_TOKEN_INIT,
    );

    Ok(Response::new()
        .add_message(transfer_msg)
        .add_submessage(yes_token_instantiate)
        .add_attribute("action", "create_poll_started")
        .add_attribute("creator", info.sender)
        .add_attribute("question", question)
        .add_attribute("yes_token_name", yes_token_name)
        .add_attribute("yes_token_symbol", yes_token_symbol)
        .add_attribute("no_token_name", no_token_name)
        .add_attribute("no_token_symbol", no_token_symbol))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    match msg.id {
        REPLY_YES_TOKEN_INIT => handle_yes_token_reply(deps, msg),
        REPLY_NO_TOKEN_INIT => handle_no_token_reply(deps, _env, msg),
        REPLY_POLL_INIT => handle_poll_reply(deps, msg),
        id => Err(ContractError::UnknownReplyId { id }),
    }
}

fn handle_yes_token_reply(deps: DepsMut, msg: Reply) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let mut temp_data = TEMP_POLL_DATA.load(deps.storage)?;
    
    // Extract YES token address from instantiate reply
    let yes_token = msg.result.unwrap().events
        .iter()
        .find(|e| e.ty == "instantiate")
        .and_then(|e| e.attributes.iter().find(|a| a.key == "_contract_address"))
        .map(|a| deps.api.addr_validate(&a.value))
        .transpose()?
        .ok_or_else(|| ContractError::NoContractAddress {})?;
    
    temp_data.yes_token = Some(yes_token);
    TEMP_POLL_DATA.save(deps.storage, &temp_data)?;

    // Create NO token
    let no_token_init = cw20_base::msg::InstantiateMsg {
        // name: no_token_name,
        // symbol: no_token_symbol,
        name: format!("NO Token for {}", temp_data.question),
        symbol: "NO".to_string(),
        decimals: 18,
        initial_balances: vec![],
        mint: Some(cw20::MinterResponse {
            //minter: info.sender.to_string(),
            minter: temp_data.creator.to_string(),
            cap: None,
        }),
        marketing: None,
    };

    // let no_token_instantiate = SubMsg::new(WasmMsg::Instantiate {
    //     admin: Some(info.sender.to_string()),
    //     code_id: 1, // TODO: Get from config
    //     msg: to_binary(&no_token_init)?,
    //     funds: vec![],
    //     label: format!("NO Token for Poll {}", next_poll_count),
    // });
    let no_token_instantiate = SubMsg::reply_on_success(
        WasmMsg::Instantiate {
            admin: Some(temp_data.creator.to_string()),
            code_id: config.token_code_id,
            msg: to_binary(&no_token_init)?,
            funds: vec![],
            label: format!("NO Token for Poll {}", temp_data.question),
        },
        REPLY_NO_TOKEN_INIT,
    );

    Ok(Response::new().add_submessage(no_token_instantiate))
}

fn handle_no_token_reply(deps: DepsMut, env: Env, msg: Reply) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let mut temp_data = TEMP_POLL_DATA.load(deps.storage)?;
    
    // Extract NO token address from instantiate reply
    let no_token = msg.result.unwrap().events
        .iter()
        .find(|e| e.ty == "instantiate")
        .and_then(|e| e.attributes.iter().find(|a| a.key == "_contract_address"))
        .map(|a| deps.api.addr_validate(&a.value))
        .transpose()?
        .ok_or_else(|| ContractError::NoContractAddress {})?;
    
    temp_data.no_token = Some(no_token);
    TEMP_POLL_DATA.save(deps.storage, &temp_data)?;

    // Create Poll contract
    // let poll_instantiate = SubMsg::new(WasmMsg::Instantiate {
    //     admin: Some(info.sender.to_string()),
    //     code_id: 1, // TODO: Get from config
    //     msg: to_binary(&xion_capyflows_poll::msg::InstantiateMsg {
    //         capy_core: env.contract.address.to_string(),
    //         poll_creator: info.sender.to_string(),
    //         usde_token: config.usde_token.to_string(),
    //         susde_token: config.susde_token.to_string(),
    //         duration,
    //         yes_token: "yes_token".to_string(), // TODO: Get from instantiate reply
    //         no_token: "no_token".to_string(),   // TODO: Get from instantiate reply
    //     })?,
    //     funds: vec![],
    //     label: format!("Poll {}", next_poll_count),
    // });
    let poll_instantiate = SubMsg::reply_on_success(
        WasmMsg::Instantiate {
            admin: Some(temp_data.creator.to_string()),
            code_id: config.poll_code_id,
            msg: to_binary(&xion_capypolls_poll::msg::InstantiateMsg {
                capy_core: env.contract.address.to_string(),
                poll_creator: temp_data.creator.to_string(),
                usde_token: config.usde_token.to_string(),
                susde_token: config.susde_token.to_string(),
                duration: temp_data.duration,
                yes_token: temp_data.yes_token.unwrap().to_string(),
                no_token: temp_data.no_token.unwrap().to_string(),
            })?,
            funds: vec![],
            label: format!("Poll {}", temp_data.question),
        },
        REPLY_POLL_INIT,
    );

    Ok(Response::new().add_submessage(poll_instantiate))
}

fn handle_poll_reply(deps: DepsMut, msg: Reply) -> Result<Response, ContractError> {
    let temp_data = TEMP_POLL_DATA.load(deps.storage)?;
    let poll_count = POLL_COUNT.load(deps.storage)?;
    let next_poll_count = poll_count + 1;
    
    // Extract poll address from instantiate reply
    let poll_addr = msg.result.unwrap().events
        .iter()
        .find(|e| e.ty == "instantiate")
        .and_then(|e| e.attributes.iter().find(|a| a.key == "_contract_address"))
        .map(|a| deps.api.addr_validate(&a.value))
        .transpose()?
        .ok_or_else(|| ContractError::NoContractAddress {})?;

    let poll_info = PollInfo {
        //       // creator: info.sender.clone(),
        // // question,
        // // avatar,
        // // description,
        // // yes_token: deps.api.addr_validate("yes_token")?, // TODO: Get from instantiate reply
        // // no_token: deps.api.addr_validate("no_token")?,   // TODO: Get from instantiate reply
        // creator: temp_data.creator,
        // question: temp_data.question,
        // avatar: temp_data.avatar,
        // description: temp_data.description,
        // yes_token: temp_data.yes_token.unwrap(),
        // no_token: temp_data.no_token.unwrap(),
        // poll_addr: poll_addr.clone(),
        creator: temp_data.creator.clone(),
        question: temp_data.question.clone(),
        avatar: temp_data.avatar.clone(),
        description: temp_data.description.clone(),
        yes_token: temp_data.yes_token.unwrap(),
        no_token: temp_data.no_token.unwrap(),
        poll_addr: poll_addr.clone(),
    };
    // POLLS.save(deps.storage, &info.sender, &poll_info)?;
    // POLL_COUNT.save(deps.storage, &next_poll_count)?;
    POLLS.save(deps.storage, &poll_addr, &poll_info)?;
    //POLL_COUNT.save(deps.storage, &(poll_count + 1))?;
    POLL_SEQUENCE.save(deps.storage, next_poll_count, &poll_addr)?;
    POLL_COUNT.save(deps.storage, &next_poll_count)?;
    TEMP_POLL_DATA.remove(deps.storage);

    // // Ok(Response::new()
    // // .add_submessage(yes_token_instantiate)
    // // .add_submessage(no_token_instantiate)
    // // .add_submessage(poll_instantiate)
    // Ok(Response::new())

    Ok(Response::new()
        .add_attribute("action", "poll_created")
        .add_attribute("creator", temp_data.creator)
        .add_attribute("poll_address", poll_addr)
        .add_attribute("yes_token", poll_info.yes_token)
        .add_attribute("no_token", poll_info.no_token)
        .add_attribute("question", poll_info.question)
        .add_attribute("poll_count", next_poll_count.to_string()))
}

// pub fn execute_update_cloneable_poll_address(
pub fn execute_update_poll_code_id(
    deps: DepsMut,
    info: MessageInfo,
    // address: String,
    code_id: u64,
) -> Result<Response, ContractError> {
    //let config = CONFIG.load(deps.storage)?;
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    //let _addr = deps.api.addr_validate(&address)?;
    // TODO: Save cloneable poll address
    config.poll_code_id = code_id;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_poll_code_id")
        .add_attribute("old_code_id", config.poll_code_id.to_string())
        .add_attribute("new_code_id", code_id.to_string()))
}

//pub fn execute_update_cloneable_token_address(
pub fn execute_update_token_code_id(
    deps: DepsMut,
    info: MessageInfo,
    //address: String,
    code_id: u64,
) -> Result<Response, ContractError> {
    //let config = CONFIG.load(deps.storage)?;

    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    //let _addr = deps.api.addr_validate(&address)?;
    // TODO: Save cloneable token address
    config.token_code_id = code_id;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_token_code_id")
        .add_attribute("old_code_id", config.token_code_id.to_string())
        .add_attribute("new_code_id", code_id.to_string()))
}

pub fn execute_update_usde_token_address(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    let old_address = config.usde_token.to_string();
    config.usde_token = deps.api.addr_validate(&address)?;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_usde_token")
        .add_attribute("old_address", old_address)
        .add_attribute("new_address", address))
}

pub fn execute_update_susde_token_address(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    let old_address = config.susde_token.to_string();
    config.susde_token = deps.api.addr_validate(&address)?;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_susde_token")
        .add_attribute("old_address", old_address)
        .add_attribute("new_address", address))
}

pub fn execute_set_initial_fee(
    deps: DepsMut,
    info: MessageInfo,
    new_fee: Uint128,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    let old_fee = config.initial_fee;
    config.initial_fee = new_fee;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_initial_fee")
        .add_attribute("old_fee", old_fee)
        .add_attribute("new_fee", new_fee))
}

pub fn execute_set_protocol_fee(
    deps: DepsMut,
    info: MessageInfo,
    new_fee: u64,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    if new_fee > config.max_protocol_fee {
        return Err(ContractError::InvalidFee("Fee too high".to_string()));
    }

    let old_fee = config.protocol_fee;
    config.protocol_fee = new_fee;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "update_protocol_fee")
        .add_attribute("old_fee", old_fee.to_string())
        .add_attribute("new_fee", new_fee.to_string()))
}

pub fn execute_withdraw_fees(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    to: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.owner {
        return Err(ContractError::Unauthorized {});
    }

    let to_addr = deps.api.addr_validate(&to)?;
    let balance = deps.querier.query_wasm_smart(
        config.usde_token.clone(),
        &cw20::Cw20QueryMsg::Balance {
            address: env.contract.address.to_string(),
        },
    )?;

    let transfer_msg = WasmMsg::Execute {
        contract_addr: config.usde_token.to_string(),
        msg: to_binary(&Cw20ExecuteMsg::Transfer {
            recipient: to_addr.to_string(),
            amount: balance,
        })?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(transfer_msg)
        .add_attribute("action", "withdraw_fees")
        .add_attribute("to", to)
        .add_attribute("amount", balance))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetConfig {} => to_binary(&query_config(deps)?),
        QueryMsg::GetPollCount {} => to_binary(&query_poll_count(deps)?),
        QueryMsg::GetPollAt { index } => to_binary(&query_poll_at(deps, index)?),
        QueryMsg::IsPollFromFactory { poll_address } => {
            to_binary(&query_is_poll_from_factory(deps, poll_address)?)
        }
        QueryMsg::GetPollDetails { poll_address } => {
            to_binary(&query_poll_details(deps, poll_address)?)
        }
    }
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        owner: config.owner.to_string(),
        usde_token: config.usde_token.to_string(),
        susde_token: config.susde_token.to_string(),
        initial_fee: config.initial_fee,
        protocol_fee: config.protocol_fee,
        max_protocol_fee: config.max_protocol_fee,
        poll_code_id: config.poll_code_id,
        token_code_id: config.token_code_id,
    })
}

fn query_poll_count(deps: Deps) -> StdResult<PollCountResponse> {
    let count = POLL_COUNT.load(deps.storage)?;
    Ok(PollCountResponse { count })
}

fn query_poll_at(deps: Deps, index: u64) -> StdResult<PollResponse> {
    let count = POLL_COUNT.load(deps.storage)?;
    if index >= count {
        return Err(cosmwasm_std::StdError::generic_err("Index out of bounds"));
    }

    let poll_addr = POLL_SEQUENCE.load(deps.storage, index)?;
    Ok(PollResponse {
        address: poll_addr.to_string(),
    })
}

fn query_is_poll_from_factory(deps: Deps, poll_address: String) -> StdResult<bool> {
    // let _addr = deps.api.addr_validate(&poll_address)?;
    // // TODO: Implement proper poll validation
    // Ok(false)
    let addr = deps.api.addr_validate(&poll_address)?;
    Ok(POLLS.has(deps.storage, &addr))
}

fn query_poll_details(deps: Deps, poll_address: String) -> StdResult<PollDetailsResponse> {
    let addr = deps.api.addr_validate(&poll_address)?;
    let poll_info = POLLS.may_load(deps.storage, &addr)?;

    Ok(PollDetailsResponse {
        exists: poll_info.is_some(),
        description: poll_info.map(|p| p.description),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::{
        coins, testing::{mock_dependencies, mock_env, mock_info, MockApi, MockQuerier}, Api, MemoryStorage, OwnedDeps
    };

    fn setup_contract() -> (OwnedDeps<MemoryStorage, MockApi, MockQuerier>, cosmwasm_std::Env) {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "earth"));

        let msg = InstantiateMsg {
            usde_token: "usde_token".to_string(),
            susde_token: "susde_token".to_string(),
            initial_fee: Uint128::new(1000000),
            protocol_fee: 100,
            poll_code_id: 1,
            token_code_id: 2,
        };

        instantiate(deps.as_mut(), env.clone(), info, msg).unwrap();
        (deps, env)
    }

    #[test]
    fn proper_initialization() {
        let (deps, _) = setup_contract();
        
        let config = CONFIG.load(deps.as_ref().storage).unwrap();
        assert_eq!(config.owner, deps.api.addr_validate("creator").unwrap());
        assert_eq!(config.usde_token, deps.api.addr_validate("usde_token").unwrap());
        assert_eq!(config.susde_token, deps.api.addr_validate("susde_token").unwrap());
        assert_eq!(config.initial_fee, Uint128::new(1000000));
        assert_eq!(config.protocol_fee, 100);
        assert_eq!(config.max_protocol_fee, MAX_PROTOCOL_FEE);
        assert_eq!(config.poll_code_id, 1);
        assert_eq!(config.token_code_id, 2);
    }
} 