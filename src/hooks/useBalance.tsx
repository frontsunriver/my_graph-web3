import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import { UPDATE_BALANCE } from '../redux/actions/index';
import { useActiveWeb3React } from '.';
import { useTokenContract } from './useContract';

export function useBalance() {
  const { account } = useActiveWeb3React()

  const dispatch = useDispatch();
  
  const balance = useSelector(state => (state as any).modals.balance);

  const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);

  const refreshBalance = useCallback(async () => {
      if (!account || !tokenContract) {
        return;
      }
      try {
      const balanceOf = await tokenContract.balanceOf(account);
      if (!balanceOf) return;
  
      const balance = parseFloat(utils.formatUnits(balanceOf, 18));
      dispatch({ type: UPDATE_BALANCE, payload: {balance}, name: 'balance'});
      } catch (e) { console.error(e) }

  }, [account, tokenContract]);

 return { balance, refreshBalance }
}
