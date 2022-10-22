import { AnyAction } from "redux";
import { ACCOUNT_UPDATE, GRAPH_UPDATE, WALLET_UPDATE, SET_MODAL_DATA, UPDATE_BALANCE, UPDATE_BALANCE_CONTRACT, UPDATE_STAKING_BALANCE } from "../actions/index";

const initialState = {
    walletManager: { show: false },
    balance: { amount: 0 },
    staking: { amount: 0 },
    balanceContract: { amount: 0 },
    graphs: { list: [], loaded: false },
    wallets: { list: [], loaded: false },
};

export const modals = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_MODAL_DATA:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    show: action.data.isVisible,
                    fn: action.data.fn,
                },
            };
        case ACCOUNT_UPDATE:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    account: action.payload.account,
                },
            };
        case UPDATE_BALANCE:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    amount: action.payload.balance,
                },
            };
        case UPDATE_BALANCE_CONTRACT:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    amount: action.payload.balanceContract,
                },
            };

        case GRAPH_UPDATE:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    list: action.payload.graphs,
                    loaded: action.payload.loaded,
                },
            };
        case WALLET_UPDATE:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    list: action.payload.wallets,
                    loaded: action.payload.loaded,
                },
            };
        case UPDATE_STAKING_BALANCE:
            return {
                ...state,
                [action.name]: {
                    ...(state as any)[action.name],
                    amount: action.payload.balance,
                },
            };
        default:
            return state;
    }
};
