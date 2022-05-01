import { ethers } from 'ethers';
import config from '../config';
import Web3WsProvider from 'web3-providers-ws';

let provider: ethers.providers.Web3Provider = null;

export function getDefaultProvider(): ethers.providers.Web3Provider {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(
      new (Web3WsProvider as any)(config.defaultWssProvider, {
        clientConfig: {
          keepalive: true,
          keepaliveInterval: 60000,
        },
        reconnect: {
          auto: true,
          delay: 5000,
          maxAttempts: 100,
          onTimeout: true,
        },
      }),
    );
  }

  return provider;
}
