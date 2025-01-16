use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, to_binary,
};
use cw20_base::contract::{
    execute as cw20_execute, instantiate as cw20_instantiate, query as cw20_query,
};
use cw20_base::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use cw2::set_contract_version;
use cw_ownable::{initialize_owner, assert_owner};

const CONTRACT_NAME: &str = "crates.io:xion-capyflows-token";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
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
) -> StdResult<Response> {
    //cw20_execute(deps, env, info, msg)
    match msg {
        ExecuteMsg::Mint { recipient, amount } => {
            // Only owner (poll contract) can mint
            assert_owner(deps.storage, &info.sender)?;
            execute_mint(deps, env, info, recipient, amount)
        }
        ExecuteMsg::Burn { amount } => {
            // Only owner (poll contract) can burn
            assert_owner(deps.storage, &info.sender)?;
            execute_burn(deps, env, info, info.sender.to_string(), amount)
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
) -> StdResult<Response> {
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
) -> StdResult<Response> {
    cw20_execute(
        deps,
        env,
        info,
        ExecuteMsg::Burn { amount },
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    //cw20_query(deps, env, msg)
    match msg {
        QueryMsg::TokenInfo {} => {
            let res = cw20_query(deps, env, msg)?;
            Ok(res)
        }
        QueryMsg::Balance { address } => {
            let res = cw20_query(deps, env, msg)?;
            Ok(res)
        }
        _ => cw20_query(deps, env, msg),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, Addr};
    use cw20::{Cw20Coin, TokenInfoResponse};

    fn setup_contract() -> (cosmwasm_std::OwnedDeps<_, _, _>, Addr) {
        let mut deps = mock_dependencies();
        let msg = InstantiateMsg {
            name: "Test Token".to_string(),
            symbol: "TEST".to_string(),
            decimals: 18,
            // initial_balances: vec![Cw20Coin {
            //     address: "creator".to_string(),
            //     amount: Uint128::new(1000000),
            // }],
            // mint: None,
            initial_balances: vec![],
            mint: Some(cw20::MinterResponse {
                minter: "owner".to_string(),
                cap: None,
            }),
            marketing: None,
        };
        //let info = mock_info("creator", &coins(1000, "earth"));
        let info = mock_info("owner", &coins(1000, "earth"));
        let env = mock_env();
        // instantiate(deps.as_mut(), env, info, msg).unwrap();
        // deps
        instantiate(deps.as_mut(), env, info.clone(), msg).unwrap();
        (deps, info.sender)
    }

    #[test]
    fn proper_initialization() {
        //let deps = setup_contract();
        let (deps, owner) = setup_contract();
        
        // Test token info query
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::TokenInfo {},
        ).unwrap();
        //let token_info: cw20::TokenInfoResponse = from_binary(&res).unwrap();
        let token_info: TokenInfoResponse = from_binary(&res).unwrap();
        assert_eq!(token_info.name, "Test Token");
        assert_eq!(token_info.symbol, "TEST");
        assert_eq!(token_info.decimals, 18);
        //assert_eq!(token_info.total_supply, Uint128::new(1000000));
        assert_eq!(token_info.total_supply, Uint128::zero());

        // Test minting
        let mint_msg = ExecuteMsg::Mint {
            recipient: "recipient".to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info(owner.as_str(), &[]);
        execute(deps.as_mut(), mock_env(), info, mint_msg).unwrap();

        // Verify balance
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::Balance {
                address: "recipient".to_string(),
            },
        ).unwrap();
        let balance: cw20::BalanceResponse = from_binary(&res).unwrap();
        assert_eq!(balance.balance, Uint128::new(1000));
    }

    #[test]
    fn test_unauthorized_mint() {
        let (deps, _) = setup_contract();
        
        // Try to mint from unauthorized account
        let mint_msg = ExecuteMsg::Mint {
            recipient: "recipient".to_string(),
            amount: Uint128::new(1000),
        };
        let info = mock_info("unauthorized", &[]);
        let err = execute(deps.as_mut(), mock_env(), info, mint_msg).unwrap_err();
        assert_eq!(err.to_string(), "Unauthorized");
    }
}

use cosmwasm_std::from_binary; 