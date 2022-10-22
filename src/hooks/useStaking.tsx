import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import { useActiveWeb3React } from '.';
import { useStakingContract } from './useContract';
import { UPDATE_STAKING_BALANCE } from '../redux/actions/index';

export function useStaking() {
	const { account } = useActiveWeb3React()
	const dispatch = useDispatch();

	const balance = useSelector(state => (state as any).modals.staking.amount);

	const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);

	const refreshBalance = useCallback(async() => {
		if (!account || !stakingContract) {
			return;
		  }
		try {
			const balanceOf = await stakingContract.getDepositedGLQ(account);
			if (!balanceOf) return;

			const balance = parseFloat(utils.formatUnits(balanceOf, 18));
			console.log(balance)
			dispatch({ type: UPDATE_STAKING_BALANCE, payload: { balance }, name: 'staking'});
		} catch (e) { console.error(e) }
	}, [account, stakingContract])

	const refreshTiersAPY = useCallback(async() => {
		if (!account || !stakingContract) {
			return;
		  }
		try {
			const tiers = await stakingContract.getTiersAPY()
			console.log(tiers)

		} catch (e) { console.error(e) }
	}, [account, stakingContract])

	return { balance, refreshBalance }
}