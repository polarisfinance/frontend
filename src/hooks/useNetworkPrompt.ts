import { useEffect, useState } from 'react';
import config from './../config';

const usePromptNetwork = () => {
  const [networkPrompt, setNetworkPrompt] = useState(false);
  const { ethereum } = window as any;

  /**
   * For more read https://github.com/NoahZinsmeister/web3-react/blob/6737868693adb7e1e28ae80499e19901e9aae45a/example/hooks.ts#L33
   * And https://docs.metamask.io/guide/ethereum-provider.html
   * @param provider ethereum provider in this case is the window.ethereum available due to metamask being installed
   * @returns
   */
  const connectToNetwork = async (ethereum: any) => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError['code'] === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${config.chainId.toString(16)}`,
                chainName: config.networkName,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [config.defaultProvider],
                blockExplorerUrls: [config.ftmscanUrl],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };
  useEffect(() => {
    if (!networkPrompt) {
      if (ethereum && ethereum.networkVersion !== config.chainId.toString()) {
        connectToNetwork(ethereum);
        setNetworkPrompt(true);
      }
    }
  }, [networkPrompt, ethereum]);
};

export default usePromptNetwork;
