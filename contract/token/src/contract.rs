use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, to_binary,
};
use cw20_base::contract::{
    execute as cw20_execute, instantiate as cw20_instantiate, query as cw20_query,
};
use cw20_base::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use cw2::set_contract_version;
use cw20_base::ContractError;
use cw_ownable::{initialize_owner, assert_owner};

const CONTRACT_NAME: &str = "crates.io:xion-capypolls-token";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    // Initialize owner (poll contract)
    initialize_owner(deps.storage, deps.api, Some(&info.sender.to_string()))?;
    
    // Initialize CW20 token
    cw20_instantiate(deps, env, info, msg)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Mint { recipient, amount } => {
            // Only owner (poll contract) can mint
            if let Err(_) = assert_owner(deps.storage, &info.sender) {
                return Err(ContractError::Unauthorized {});
            }
            execute_mint(deps, env, info, recipient, amount)
        }
        ExecuteMsg::Burn { amount } => {
            // Only owner (poll contract) can burn
            if let Err(_) = assert_owner(deps.storage, &info.sender) {
                return Err(ContractError::Unauthorized {});
            }
            execute_burn(deps, env, info.clone(), info.sender.to_string(), amount)
        }
        _ => cw20_execute(deps, env, info, msg),
    }
}

pub fn execute_mint(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    recipient: String,
    amount: Uint128,
) -> Result<Response, ContractError> {
    cw20_execute(
        deps,
        env,
        info,
        ExecuteMsg::Mint { recipient, amount },
    )
}

pub fn execute_burn(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    from: String,
    amount: Uint128,
) -> Result<Response, ContractError> {
    cw20_execute(
        deps,
        env,
        info,
        ExecuteMsg::Burn { amount },
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: &QueryMsg) -> Result<Binary, ContractError> {
    //cw20_query(deps, env, msg)
 
    match msg {
        QueryMsg::TokenInfo {} => {
            let res = cw20_query(deps, env, msg.clone())?;
            Ok(res)
        }
        QueryMsg::Balance { address } => {
            let res = cw20_query(deps, env, msg.clone())?;
            Ok(res)
        }
        _ => {
            let res = cw20_query(deps, env, msg.clone())?;
            Ok(res)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage};
    use cosmwasm_std::{coins, from_json, Addr, OwnedDeps, Uint128};
    use cw20::{Cw20Coin, TokenInfoResponse, BalanceResponse};

    fn setup_contract() -> (OwnedDeps<MockStorage, MockApi, MockQuerier>, Addr) {
        let mut deps = mock_dependencies();
        
        let msg = InstantiateMsg {
            name: "Test Token".to_string(),
            symbol: "TEST".to_string(),
            decimals: 18,
            initial_balances: vec![],
            mint: Some(cw20::MinterResponse {
                minter: "owner".to_string(),
                cap: None,
            }),
            marketing: None,
        };

        let info = mock_info("owner", &coins(1000, "earth"));
        let env = mock_env();
        
        // Initialize contract and verify success
        let res = instantiate(deps.as_mut(), env, info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        (deps, info.sender)
    }

    #[test]
    fn proper_initialization() {
        let (deps, owner) = setup_contract();
        
        // Test token info query
        let res = query(deps.as_ref(), mock_env(), &QueryMsg::TokenInfo {}).unwrap();
        let token_info: TokenInfoResponse = from_json(&res).unwrap();
        
        assert_eq!(token_info.name, "Test Token");
        assert_eq!(token_info.symbol, "TEST");
        assert_eq!(token_info.decimals, 18);
        assert_eq!(token_info.total_supply, Uint128::zero());
    }

    #[test]
    fn test_mint() {
        let (mut deps, owner) = setup_contract();
        
        // Test successful mint
        let mint_msg = ExecuteMsg::Mint {
            recipient: "recipient".to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info(owner.as_str(), &[]);
        let res = execute(deps.as_mut(), mock_env(), info, mint_msg).unwrap();
        
        // Verify mint response
        assert_eq!(0, res.messages.len());
        
        // Verify balance
        let res = query(
            deps.as_ref(),
            mock_env(),
            &QueryMsg::Balance {
                address: "recipient".to_string(),
            },
        ).unwrap();
        let balance: BalanceResponse = from_json(&res).unwrap();
        assert_eq!(balance.balance, Uint128::new(1000));
        
        // Verify total supply
        let res = query(deps.as_ref(), mock_env(), &QueryMsg::TokenInfo {}).unwrap();
        let token_info: TokenInfoResponse = from_json(&res).unwrap();
        assert_eq!(token_info.total_supply, Uint128::new(1000));
    }

    #[test]
    fn test_unauthorized_mint() {
        let (mut deps, _) = setup_contract();
        
        // Try to mint from unauthorized account
        let mint_msg = ExecuteMsg::Mint {
            recipient: "recipient".to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info("unauthorized", &[]);
        let err = execute(deps.as_mut(), mock_env(), info, mint_msg).unwrap_err();
        assert_eq!(err.to_string(), "Unauthorized");
    }

    #[test]
    fn test_burn() {
        let (mut deps, owner) = setup_contract();
        
        // First mint some tokens
        let mint_msg = ExecuteMsg::Mint {
            recipient: owner.to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info(owner.as_str(), &[]);
        execute(deps.as_mut(), mock_env(), info.clone(), mint_msg).unwrap();
        
        // Test burn
        let burn_msg = ExecuteMsg::Burn {
            amount: Uint128::new(400),
        };
        let res = execute(deps.as_mut(), mock_env(), info, burn_msg).unwrap();
        
        // Verify burn response
        assert_eq!(0, res.messages.len());
        
        // Verify balance after burn
        let res = query(
            deps.as_ref(),
            mock_env(),
            &QueryMsg::Balance {
                address: owner.to_string(),
            },
        ).unwrap();
        let balance: BalanceResponse = from_json(&res).unwrap();
        assert_eq!(balance.balance, Uint128::new(600));
        
        // Verify total supply after burn
        let res = query(deps.as_ref(), mock_env(), &QueryMsg::TokenInfo {}).unwrap();
        let token_info: TokenInfoResponse = from_json(&res).unwrap();
        assert_eq!(token_info.total_supply, Uint128::new(600));
    }

    #[test]
    fn test_unauthorized_burn() {
        let (mut deps, owner) = setup_contract();
        
        // First mint some tokens
        let mint_msg = ExecuteMsg::Mint {
            recipient: owner.to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info(owner.as_str(), &[]);
        execute(deps.as_mut(), mock_env(), info, mint_msg).unwrap();
        
        // Try to burn from unauthorized account
        let burn_msg = ExecuteMsg::Burn {
            amount: Uint128::new(400),
        };
        let unauth_info = mock_info("unauthorized", &[]);
        let err = execute(deps.as_mut(), mock_env(), unauth_info, burn_msg).unwrap_err();
        assert_eq!(err.to_string(), "Unauthorized");
    }

    #[test]
    fn test_transfer() {
        let (mut deps, owner) = setup_contract();
        
        // First mint some tokens
        let mint_msg = ExecuteMsg::Mint {
            recipient: owner.to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info(owner.as_str(), &[]);
        execute(deps.as_mut(), mock_env(), info.clone(), mint_msg).unwrap();
        
        // Test transfer
        let transfer_msg = ExecuteMsg::Transfer {
            recipient: "recipient".to_string(),
            amount: Uint128::new(400),
        };
        let res = execute(deps.as_mut(), mock_env(), info, transfer_msg).unwrap();
        
        // Verify transfer response
        assert_eq!(0, res.messages.len());
        
        // Verify recipient balance
        let res = query(
            deps.as_ref(),
            mock_env(),
            &QueryMsg::Balance {
                address: "recipient".to_string(),
            },
        ).unwrap();
        let balance: BalanceResponse = from_json(&res).unwrap();
        assert_eq!(balance.balance, Uint128::new(400));
        
        // Verify sender balance
        let res = query(
            deps.as_ref(),
            mock_env(),
            &QueryMsg::Balance {
                address: owner.to_string(),
            },
        ).unwrap();
        let balance: BalanceResponse = from_json(&res).unwrap();
        assert_eq!(balance.balance, Uint128::new(600));
    }
}
