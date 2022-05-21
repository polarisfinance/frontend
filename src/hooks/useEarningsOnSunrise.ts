import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';
import { Sunrise } from '../polaris-finance';

const useEarningsOnSunrise = (sunrise:Sunrise) => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await polarisFinance.getEarningsOnSunrise(sunrise));
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, polarisFinance, slowRefresh, sunrise]);

  return balance;
};

export default useEarningsOnSunrise;
