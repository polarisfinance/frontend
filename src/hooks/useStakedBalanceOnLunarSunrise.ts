import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnLunarSunrise = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await polarisFinance.getStakedSharesOnLunarSunrise());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, polarisFinance]);
  return balance;
};

export default useStakedBalanceOnLunarSunrise;
