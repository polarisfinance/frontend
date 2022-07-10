import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';
import { Sunrise } from '../polaris-finance';

const useTotalStakedOnMasonry = (sunrise: Sunrise) => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await polarisFinance.getTotalStakedInSunrise(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, polarisFinance, sunrise]);

  return totalStaked;
};

export default useTotalStakedOnMasonry;
