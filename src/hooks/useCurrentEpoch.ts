import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { BigNumber } from 'ethers';
import useRefresh from './useRefresh';

const useCurrentEpoch = (token: string) => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await polarisFinance.getCurrentEpoch(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, polarisFinance, slowRefresh, token]);

  return currentEpoch;
};

export default useCurrentEpoch;
