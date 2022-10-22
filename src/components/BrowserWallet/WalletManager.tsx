import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { useDispatch, useSelector } from "react-redux";
import {
  OPEN_MODAL,
  CLOSE_MODAL,
  ACCOUNT_UPDATE,
} from "../../redux/actions/index";

import { isMobile } from "react-device-detect";
import { bsc, fortmatic, injected, portis } from "../../connectors/index";
import { OVERLAY_READY } from "../../connectors/fortmatic";

import { SUPPORTED_WALLETS } from "../../constants/index";
import usePrevious from "../../hooks/usePrevious";

import Option from "./Option";
import PendingView from "./PendingView";
import { useHistory } from "react-router-dom";
import WalletService from "../../services/walletService";
import Web3 from "web3"
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Text, Link } from "@chakra-ui/react";

const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
};

const WalletManager = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { active, account, connector, activate, error, library } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const [pendingWallet, setPendingWallet] = useState();

  const [pendingError, setPendingError] = useState(false);

  const previousAccount = usePrevious(account);

  const walletModalOpen = useSelector(
    (state: any) => state.modals.walletManager.show
  );

  const binanceWalletSign = async (web3: any) => {
    return new Promise<string>((res, rej) => {
      web3
      .request({
        method: 'eth_sign',
        params: [account, process.env.REACT_APP_SIGN_KEY as string],
      })
      .then((result: any) => {
       res(result)
      })
      .catch((error: any) => {
        rej(error)
    });
    })

  }

  useEffect(() => {
    if (!account) { return }
    if (WalletService.verifySessionIntegrity(account)) {
      return history.push("/");
    }
      (async () => {
        console.log(activate)
        let web3: any = undefined
        let signature: string = ""
        const firstChain = (connector as any).supportedChainIds[0]
        // if ((window as any).BinanceChain !== undefined && firstChain !== 100) {
        //   web3 = (window as any).BinanceChain
        //   try {
        //     signature = await binanceWalletSign(web3)
        //   } catch (e) { console.error(e)}
        // }
        // else 
        if ((window as any).ethereum !== undefined) {
          web3 = new Web3((window as any).ethereum)
          try {
            signature = await web3.eth.personal.sign(process.env.REACT_APP_SIGN_KEY as string, account, "")
          } catch (e) { console.error(e) }
        }
        const result = await WalletService.authWallet(account, signature)

        if (result) {
          dispatch({
            name: "walletManager",
            type: ACCOUNT_UPDATE,
            payload: {
              account,
            },
          });
          return history.push("/");
        }
    })()
  }, [account])

  const toggleWalletModal = () => {
    if (walletModalOpen) dispatch({ type: CLOSE_MODAL, name: "walletManager" });
    else dispatch({ type: OPEN_MODAL, name: "walletManager" });
  };

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (connector: any) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === (SUPPORTED_WALLETS as any)[key].connector) {
        return (SUPPORTED_WALLETS as any)[key].name;
      }
      return true;
    });

    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal();
    });
  }, [toggleWalletModal]);

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask =
      (window as any).ethereum && (window as any).ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = (SUPPORTED_WALLETS as any)[key];
      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.connector === portis) {
          return null;
        }

        if (
          !(window as any).web3 &&
          !(window as any).ethereum &&
          option.mobile
        ) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              icon={option.iconName}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected || option.connector === bsc) {
        // don't show injected if there's no injected provider
        if (!((window as any).web3 || (window as any).ethereum)) {
          if (option.name === "MetaMask") {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header="Install Metamask"
                subheader={undefined}
                link="https://metamask.io/"
                icon={"MetaMaskIcon"}
              />
            );
          }
          else if (option.name === "Binance Chain Wallet") {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header="Install Binance Chain Wallet"
                subheader={undefined}
                link="https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp"
                icon={"BinanceIcon"}
              />
            );
          }
          return null; // dont want to return install twice
        }
        // don't return metamask if injected provider isn't metamask
        if (option.name === "MetaMask" && !isMetamask) {
          return null;
        }
        // likewise for generic
        if (option.name === "Injected" && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            link={option.href}
            header={option.name}
            subheader={undefined} // use option.descriptio to bring back multi-line
            icon={option.iconName}
          />
        )
      );
    });
  }

  function getContent() {
    if (error) {
      console.log(error);
      return (
        <Alert
          status="error"
          variant="subtle"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {error instanceof UnsupportedChainIdError
              ? "Wrong Network"
              : "Error connecting"}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error instanceof UnsupportedChainIdError ? (
              <Box>
                <Text>Please connect to the appropriate Ethereum network (Ropsten Or Mainnet).</Text>
                <Link href="https://docs.graphlinq.io/wallet/1-index" textDecoration="underline" isExternal>Check out the documentation about wallet</Link>
              </Box>
            ) : (
                "Error connecting. Try refreshing the page."
              )}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        {walletView === WALLET_VIEWS.PENDING ? (
          <PendingView
            connector={pendingWallet}
            error={pendingError}
            setPendingError={setPendingError}
            tryActivation={tryActivation}
          />
        ) : (
            <>{getOptions()}</>
          )}
      </>
    );
  }

  return <>{getContent()}</>;
};

export default WalletManager;
