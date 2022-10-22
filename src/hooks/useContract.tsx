import { useMemo } from 'react';
import ERC20 from '../contracts/ERC20.json';
import GraphLinqDepositor from '../contracts/GraphLinqDepositor.json'
import GraphLinqPrivateSale from '../contracts/GraphLinqPrivateSale.json'
import GraphLinqStaking from '../contracts/GlqStakingContract.json'
import { getContract } from '../utils';
import { useActiveWeb3React } from './index';

// returns null on errors
function useContract(address: any, ABI: any, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      const contract = getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
      return contract
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(tokenAddress: any, withSignerIfPossible = true) {
  return useContract(tokenAddress, ERC20.abi, withSignerIfPossible);
}

export function useBalanceContract(address: any,withSignerIfPossible = true) {
  return useContract(address, GraphLinqDepositor.abi, withSignerIfPossible);
}

export function usePresaleContract(address: any,withSignerIfPossible = true) {
  return useContract(address, GraphLinqPrivateSale.abi, withSignerIfPossible);
}

export function useStakingContract(address: any,withSignerIfPossible = true) {
  return useContract(address, GraphLinqStaking.abi, withSignerIfPossible);
}