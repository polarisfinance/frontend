import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { BigNumber } from 'ethers';
import useRefresh from './useRefresh';
import { Sunrise } from '../polaris-finance';

const useCurrentEpoch = (sunrise: Sunrise) => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await polarisFinance.getCurrentEpoch(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, polarisFinance, slowRefresh, sunrise]);

  return currentEpoch;
};

export default useCurrentEpoch;
