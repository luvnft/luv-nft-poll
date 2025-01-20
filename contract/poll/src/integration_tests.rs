use super::*;
use crate::msg::*;
use crate::contract::{instantiate, execute, query};
use crate::error::ContractError;
use crate::state::{calculate_epoch_distribution};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{
    coins, from_json, Addr, Coin, Uint128, CosmosMsg, BankMsg,
    Response, StdResult, to_json_binary,
};

const XION_DENOM: &str = "uxion";

#[cfg(test)]
mod tests {
    use super::*;
    use crate::msg::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json, Addr, Coin};

    #[test]
    fn full_poll_lifecycle() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
            duration: 1000,
            denom: XION_DENOM.to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Stake XION
        let stake_amount = Uint128::new(100);
        let stake_info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: stake_amount,
            }],
        );
        execute(
            deps.as_mut(),
            env.clone(),
            stake_info,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: true,
            },
        )
        .unwrap();

        // Query total staked
        let query_msg = QueryMsg::GetTotalStaked {};
        let res: TotalStakedResponse =
            from_json(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
        assert_eq!(res.total_yes, stake_amount);
        assert_eq!(res.total_no, Uint128::zero());
        assert_eq!(res.denom, XION_DENOM);

        // Resolve poll
        let resolve_info = mock_info("capy_core", &[]);
        execute(
            deps.as_mut(),
            env.clone(),
            resolve_info,
            ExecuteMsg::ResolvePoll {
                winning_position: true,
            },
        )
        .unwrap();

        // Withdraw stakes
        let withdraw_info = mock_info("user1", &[]);
        let res = execute(
            deps.as_mut(),
            env.clone(),
            withdraw_info,
            ExecuteMsg::WithdrawStake {},
        )
        .unwrap();

        // Verify withdrawal message
        assert_eq!(1, res.messages.len());
        match &res.messages[0].msg {
            CosmosMsg::Bank(BankMsg::Send { to_address, amount }) => {
                assert_eq!(to_address, "user1");
                assert_eq!(
                    amount,
                    &vec![Coin {
                        denom: XION_DENOM.to_string(),
                        amount: stake_amount,
                    }]
                );
            }
            _ => panic!("Expected BankMsg::Send"),
        }
    }

    #[test]
    fn test_multiple_epochs() {
        let mut deps = mock_dependencies();
        let mut env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
            duration: 1000,
            denom: XION_DENOM.to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Stake in first epoch
        let stake_amount = Uint128::new(100);
        let stake_info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: stake_amount,
            }],
        );
        execute(
            deps.as_mut(),
            env.clone(),
            stake_info,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: true,
            },
        )
        .unwrap();

        // Move to next epoch
        env.block.time = env.block.time.plus_seconds(250);
        
        // Stake in second epoch
        let stake_info_2 = mock_info(
            "user2",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: stake_amount,
            }],
        );
        execute(
            deps.as_mut(),
            env.clone(),
            stake_info_2,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: false,
            },
        )
        .unwrap();

        // Query epoch info
        let query_msg = QueryMsg::GetEpochInfo { epoch_number: 2 };
        let res: EpochInfoResponse =
            from_json(&query(deps.as_ref(), env.clone(), query_msg).unwrap()).unwrap();
        assert_eq!(res.total_distribution, calculate_epoch_distribution(2));
        assert_eq!(res.num_stakers, 1);
        assert!(!res.is_distributed);
    }

    #[test]
    fn test_error_cases() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
            duration: 1000,
            denom: XION_DENOM.to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Try to stake with wrong denom
        let stake_amount = Uint128::new(100);
        let stake_info = mock_info(
            "user1",
            &[Coin {
                denom: "invalid".to_string(),
                amount: stake_amount,
            }],
        );
        let err = execute(
            deps.as_mut(),
            env.clone(),
            stake_info,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: true,
            },
        )
        .unwrap_err();
        assert_eq!(err, ContractError::NoXionPayment {});

        // Try to stake with insufficient amount
        let stake_info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: Uint128::new(50),
            }],
        );
        let err = execute(
            deps.as_mut(),
            env.clone(),
            stake_info,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: true,
            },
        )
        .unwrap_err();
        assert_eq!(err, ContractError::InvalidPaymentAmount {});

        // Try to withdraw before poll is resolved
        let withdraw_info = mock_info("user1", &[]);
        let err = execute(
            deps.as_mut(),
            env.clone(),
            withdraw_info,
            ExecuteMsg::WithdrawStake {},
        )
        .unwrap_err();
        assert_eq!(err, ContractError::PollNotResolved {});

        // Try to resolve poll with unauthorized address
        let resolve_info = mock_info("anyone", &[]);
        let err = execute(
            deps.as_mut(),
            env.clone(),
            resolve_info,
            ExecuteMsg::ResolvePoll {
                winning_position: true,
            },
        )
        .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});
    }

    #[test]
    fn test_epoch_distribution() {
        let mut deps = mock_dependencies();
        let mut env = mock_env();

        // Setup contract
        let init_msg = InstantiateMsg {
            capy_core: "capy_core".to_string(),
            poll_creator: "creator".to_string(),
            yes_token: "yes_token".to_string(),
            no_token: "no_token".to_string(),
            duration: 1000,
            denom: XION_DENOM.to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), init_msg).unwrap();

        // Stake in first epoch
        let stake_amount = Uint128::new(100);
        let stake_info = mock_info(
            "user1",
            &[Coin {
                denom: XION_DENOM.to_string(),
                amount: stake_amount,
            }],
        );
        execute(
            deps.as_mut(),
            env.clone(),
            stake_info,
            ExecuteMsg::Stake {
                amount: stake_amount,
                position: true,
            },
        )
        .unwrap();

        // Move to end of first epoch
        env.block.time = env.block.time.plus_seconds(251);

        // Try to distribute rewards for epoch 2 (not started)
        let err = execute(
            deps.as_mut(),
            env.clone(),
            info.clone(),
            ExecuteMsg::DistributeEpochRewards { epoch_number: 2 },
        )
        .unwrap_err();
        assert_eq!(err, ContractError::EpochNotStarted {});

        // Distribute rewards for epoch 1
        let res = execute(
            deps.as_mut(),
            env.clone(),
            info.clone(),
            ExecuteMsg::DistributeEpochRewards { epoch_number: 1 },
        )
        .unwrap();

        // Verify distribution message
        assert_eq!(1, res.messages.len());
        assert_eq!(
            res.attributes,
            vec![
                ("action", "distribute_epoch_rewards"),
                ("epoch", "1"),
            ]
        );

        // Try to distribute again
        let err = execute(
            deps.as_mut(),
            env.clone(),
            info.clone(),
            ExecuteMsg::DistributeEpochRewards { epoch_number: 1 },
        )
        .unwrap_err();
        assert_eq!(err, ContractError::EpochAlreadyDistributed {});
    }
} 