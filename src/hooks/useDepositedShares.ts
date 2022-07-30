import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import { ContractName } from '../polaris-finance';
import config from '../config';

const useDepositedBalance = (poolName: ContractName) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await polarisFinance.depositedSharesOnAC(poolName, polarisFinance.myAccount);
    setBalance(balance);
  }, [poolName, polarisFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, setBalance, polarisFinance, fetchBalance]);

  return balance;
};

export default useDepositedBalance;
