import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { JSBI, Percent } from '@uniswap/sdk';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
};

export function getEtherscanLink(chainId: any, data: any, type: any) {
  const prefix = `https://${(ETHERSCAN_PREFIXES as any)[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: any, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 10)}...${parsed.substring(30 - chars)}`;
}

export function shortenRefId(refId: any, chars = 10) {
  return `${refId.substring(0, chars + 2)}...${refId.substring(refId.length - chars)}`;
}

// add 10%
export function calculateGasMargin(value: any) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: any) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function calculateSlippageAmount(value: any, slippage: any) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ];
}

// account is not optional
export function getSigner(library: any, account: any) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: any, account: any) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: any, ABI:any, library:any, account: any) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function escapeRegExp(string: any) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getDecimalsAmount (amount: number)  {
  return (amount * (10 ** 18)).toFixed()
}
