import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import PolarisFinance from '../../polaris-finance';
import config from '../../config';

export interface PolarisFinanceContext {
  polarisFinance?: PolarisFinance;
}

export const Context = createContext<PolarisFinanceContext>({ polarisFinance: null });

export const PolarisFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [polarisFinance, setTombFinance] = useState<PolarisFinance>();

  useEffect(() => {
    if (!polarisFinance) {
      const polar = new PolarisFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        polar.unlockWallet(ethereum, account);
      }
      setTombFinance(polar);
    } else if (account) {
      polarisFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, polarisFinance]);

  return <Context.Provider value={{ polarisFinance }}>{children}</Context.Provider>;
};
