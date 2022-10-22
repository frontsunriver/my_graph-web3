import {RESET_REDUX_STATE, DIAGRAM_UPDATE} from "../constants/actions";

export const ResetReduxState = () => ({
    type: RESET_REDUX_STATE
});

export const DiagramMove = () => ({
    type: DIAGRAM_UPDATE
});

// Wallets
export const OPEN_MODAL = 'openModal';
export const CLOSE_MODAL = 'closeModal';
export const SET_MODAL_DATA = 'setModalData';
export const ACCOUNT_UPDATE = 'accountUpdate';

// Balance
export const UPDATE_BALANCE = 'updateBalance';

// Balance wallet contract
export const UPDATE_BALANCE_CONTRACT = 'updateBalanceContract'

// Graphs
export const GRAPH_UPDATE = "graphUpdate";

// Managed Wallets
export const WALLET_UPDATE = "walletUpdate";

// Staking

export const UPDATE_STAKING_BALANCE = 'updateStakingBalance'