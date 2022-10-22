
import { fortmatic, injected, portis, walletconnect, walletlink, bsc } from '../connectors/index'

export const SUPPORTED_WALLETS = {
    INJECTED: {
      connector: injected,
      name: 'Injected',
      iconName: 'MetaMaskIcon',
      description: 'Injected web3 provider.',
      href: null,
      primary: true
    },
    // BINANCE: {
    //   connector: bsc,
    //   name: 'Binance Chain Wallet',
    //   iconName: 'BinanceIcon',
    //   description: 'A Crypto Wallet for Binance Chain, Binance Smart Chain and Ethereum',
    //   href: null,
    // },
    METAMASK: {
      connector: injected,
      name: 'MetaMask',
      iconName: 'MetaMaskIcon',
      description: 'Easy-to-use browser extension.',
      href: null,
    },
    WALLET_CONNECT: {
      connector: walletconnect,
      name: 'WalletConnect',
      iconName: 'WalletConnectIcon',
      description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
      href: null,
      mobile: true
    },
    WALLET_LINK: {
      connector: walletlink,
      name: 'Coinbase Wallet',
      iconName: 'CoinbaseWalletIcon',
      description: 'Use Coinbase Wallet app on mobile device',
      href: null,
    },
    COINBASE_LINK: {
      name: 'Open in Coinbase Wallet',
      iconName: 'CoinbaseWalletIcon',
      description: 'Open in Coinbase Wallet app.',
      href: 'https://go.cb-w.com/mtUDhEZPy1',
      mobile: true,
      mobileOnly: true
    },
    FORTMATIC: {
      connector: fortmatic,
      name: 'Fortmatic',
      iconName: 'FortmaticIcon',
      description: 'Login using Fortmatic hosted wallet',
      href: null,
      mobile: true
    },
    Portis: {
      connector: portis,
      name: 'Portis',
      iconName: 'PortisIcon',
      description: 'Login using Portis hosted wallet',
      href: null,
      mobile: true
    }
  }
  
  export const NetworkContextName = 'NETWORK'