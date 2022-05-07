import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { BigNumber } from 'ethers';
import useRefresh from './useRefresh';

const useCurrentEpoch = () => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await polarisFinance.getCurrentEpoch());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, polarisFinance, slowRefresh]);

  return currentEpoch;
};

export default useCurrentEpoch;
