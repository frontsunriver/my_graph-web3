import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { network } from "../connectors";
import { useEagerConnect, useInactiveListener } from "../hooks";
// import { useHornBalance } from 'src/hooks/useHornBalance'
import { useBalance } from "../hooks/useBalance";

import { NetworkContextName } from "../constants";

export default function Web3ReactManager({ children }: any) {
  const { active, chainId, account } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);
  const { refreshBalance }: any = useBalance();

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  useEffect(() => {
    // setting account and refreshing glq balance
    refreshBalance();
  }, [chainId, account]);

  return children;
}
