import { useEffect } from 'react';
// import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import { useWallet } from 'use-wallet';

let connected = false;
const useEagerConnect = () => {
  // const { login } = useAuth()
  const { account, connect, connector } = useWallet();

  if (account && window.localStorage.getItem('connectorId') === '') {
    window.localStorage.setItem('connectorId', connector);
  }

  useEffect(() => {
    const connectorId = window.localStorage.getItem('connectorId');
    if (!connected) {
      if (connectorId && !account) {
        connect(connectorId);
      }
      connected = true;
    }
  }, [connect, account]);
};

export default useEagerConnect;
