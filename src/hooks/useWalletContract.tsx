import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import { UPDATE_BALANCE_CONTRACT } from '../redux/actions/index';
import { useActiveWeb3React } from '.';
import { useBalanceContract } from './useContract';

export function useWalletContract() {
  const { account } = useActiveWeb3React()

  const dispatch = useDispatch();
  
  const balance = useSelector(state => (state as any).modals.balanceContract);

  const contract = useBalanceContract(process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);

  const refreshBalanceContract = useCallback(async () => {
      if (!account || !contract) {
        return;
      }
      try {
      const balanceOf = await contract.getBalance(account);
      if (!balanceOf) return;
  
      const balance = parseFloat(utils.formatUnits(balanceOf, 18));
      dispatch({ type: UPDATE_BALANCE_CONTRACT, payload: {balanceContract: balance}, name: 'balanceContract'});
      } catch (e) { console.error(e) }

  }, [account, contract]);

 return { balance, refreshBalanceContract }
}
