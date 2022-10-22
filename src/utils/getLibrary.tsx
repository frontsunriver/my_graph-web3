import { Web3Provider } from '@ethersproject/providers';

export default function getLibrary(provider: any) {
  const library = new Web3Provider(provider, 'any');
  library.pollingInterval = 15000;
  return library;
}
