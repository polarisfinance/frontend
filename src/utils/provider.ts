import { ethers } from 'ethers';
import config from '../config';
import { web3ProviderFrom } from '../polaris-finance/ether-utils';
import Web3WsProvider from 'web3-providers-ws';

let provider: ethers.providers.Web3Provider = null;

export function getDefaultProvider(): ethers.providers.Web3Provider {
  if (!provider) {
    provider = !config.defaultWssProvider.includes('wss')
      ? new ethers.providers.Web3Provider(web3ProviderFrom(config.defaultWssProvider), config.chainId)
      : new ethers.providers.Web3Provider(
          new (Web3WsProvider as any)(config.defaultWssProvider, {
            timeout: 30000, // ms
            clientConfig: {
              keepalive: true,
              keepaliveInterval: 6000000,
            },
            reconnect: {
              auto: true,
              delay: 5000,
              maxAttempts: 200,
              onTimeout: true,
            },
          }),
        );
  }

  return provider;
}
