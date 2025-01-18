use super::*;
use crate::msg::*;
use crate::contract::{instantiate, execute, query};
use crate::error::ContractError;
use crate::state::{REPLY_YES_TOKEN_INIT};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{
    coins, from_json, Addr, Coin, SubMsg, WasmMsg, Uint128,
    Response, StdResult, to_json_binary,
};
use cw20_base::msg::InstantiateMsg as Cw20InstantiateMsg;

const XION_DENOM: &str = "uxion";

#[cfg(test)]
mod tests {
    use super::*;
    use crate::msg::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json, Addr, Coin, SubMsg, WasmMsg, CosmosMsg};
    use cw20_base::msg::InstantiateMsg as Cw20InstantiateMsg;

    #[test]
    fn full_poll_creation_lifecycle() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            initial_fee: Uint128::new(1000000),
            protocol_fee: 100,
            poll_code_id: 1,
            token_code_id: 2,
        };
        let info = mock_info("owner", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Create poll with correct XION fee
        let create_poll_msg = ExecuteMsg::CreatePoll {
            question: "Test Poll?".to_string(),
            avatar: "avatar_url".to_string(),
            description: "Test Description".to_string(),
            duration: 1000,
            yes_token_name: "YES".to_string(),
            yes_token_symbol: "YES".to_string(),
            no_token_name: "NO".to_string(),
            no_token_symbol: "NO".to_string(),
        };
        let info = mock_info(
            "creator",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: Uint128::new(1000000),
            }],
        );

        let res = execute(deps.as_mut(), env.clone(), info.clone(), create_poll_msg).unwrap();

        // Verify YES token creation message
        assert_eq!(1, res.messages.len());
        if let SubMsg { msg, id, .. } = &res.messages[0] {
            assert_eq!(*id, REPLY_YES_TOKEN_INIT);
            match msg.clone() {
                CosmosMsg::Wasm(WasmMsg::Instantiate {
                    admin,
                    code_id,
                    msg: init_msg,
                    funds,
                    label,
                }) => {
                    assert_eq!(admin.unwrap(), "creator");
                    assert_eq!(code_id, 2);
                    assert!(funds.is_empty());
                    assert_eq!(label, "YES Token for Poll Test Poll?");

                    let init_msg: Cw20InstantiateMsg = from_json(init_msg).unwrap();
                    assert_eq!(init_msg.name, "YES");
                    assert_eq!(init_msg.symbol, "YES");
                    assert_eq!(init_msg.decimals, 18);
                    assert!(init_msg.initial_balances.is_empty());
                    assert_eq!(
                        init_msg.mint.unwrap().minter,
                        "creator"
                    );
                }
                _ => panic!("Expected WasmMsg::Instantiate"),
            }
        }

        // Query poll count
        let query_msg = QueryMsg::GetPollCount {};
        let res: PollCountResponse = from_json(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
        assert_eq!(res.count, 0); // Count is updated after poll creation is complete

        // Query config
        let query_msg = QueryMsg::GetConfig {};
        let res: ConfigResponse = from_json(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
        assert_eq!(res.owner, "owner");
        assert_eq!(res.initial_fee, Uint128::new(1000000));
        assert_eq!(res.protocol_fee, 100);
        assert_eq!(res.poll_code_id, 1);
        assert_eq!(res.token_code_id, 2);
        assert_eq!(res.denom, XION_DENOM);
    }

    #[test]
    fn test_fee_management() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            initial_fee: Uint128::new(1000000),
            protocol_fee: 100,
            poll_code_id: 1,
            token_code_id: 2,
        };
        let info = mock_info("owner", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Update initial fee
        let msg = ExecuteMsg::SetInitialFee {
            new_fee: Uint128::new(2000000),
        };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(
            res.attributes,
            vec![
                ("action", "update_initial_fee"),
                ("old_fee", "1000000"),
                ("new_fee", "2000000"),
            ]
        );

        // Update protocol fee
        let msg = ExecuteMsg::SetProtocolFee { new_fee: 200 };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(
            res.attributes,
            vec![
                ("action", "update_protocol_fee"),
                ("old_fee", "100"),
                ("new_fee", "200"),
            ]
        );

        // Try to set protocol fee too high
        let msg = ExecuteMsg::SetProtocolFee { new_fee: 2000 };
        let err = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap_err();
        assert_eq!(
            err,
            ContractError::InvalidFee("Fee too high".to_string())
        );

        // Try to update fees with non-owner
        let unauth_info = mock_info("anyone", &[]);
        let msg = ExecuteMsg::SetInitialFee {
            new_fee: Uint128::new(3000000),
        };
        let err = execute(deps.as_mut(), env.clone(), unauth_info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});
    }

    #[test]
    fn test_code_id_management() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            initial_fee: Uint128::new(1000000),
            protocol_fee: 100,
            poll_code_id: 1,
            token_code_id: 2,
        };
        let info = mock_info("owner", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Update poll code ID
        let msg = ExecuteMsg::UpdatePollCodeId { code_id: 5 };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(
            res.attributes,
            vec![
                ("action", "update_poll_code_id"),
                ("old_code_id", "1"),
                ("new_code_id", "5"),
            ]
        );

        // Update token code ID
        let msg = ExecuteMsg::UpdateTokenCodeId { code_id: 6 };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(
            res.attributes,
            vec![
                ("action", "update_token_code_id"),
                ("old_code_id", "2"),
                ("new_code_id", "6"),
            ]
        );

        // Try to update code IDs with non-owner
        let unauth_info = mock_info("anyone", &[]);
        let msg = ExecuteMsg::UpdatePollCodeId { code_id: 10 };
        let err = execute(deps.as_mut(), env.clone(), unauth_info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});
    }

    #[test]
    fn test_poll_queries() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            initial_fee: Uint128::new(1000000),
            protocol_fee: 100,
            poll_code_id: 1,
            token_code_id: 2,
        };
        let info = mock_info("owner", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Query non-existent poll
        let query_msg = QueryMsg::GetPollDetails {
            poll_address: "poll1".to_string(),
        };
        let res: PollDetailsResponse = from_json(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
        assert!(!res.exists);
        assert!(res.description.is_none());

        // Query out of bounds poll
        let query_msg = QueryMsg::GetPollAt { index: 0 };
        let err = query(deps.as_ref(), env.clone(), query_msg).unwrap_err();
        assert_eq!(
            err,
            cosmwasm_std::StdError::generic_err("Index out of bounds")
        );
    }
} 