import { useCallback, useState, useEffect } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { Bank } from '../polaris-finance';
import { PoolStats } from '../polaris-finance/types';
import config from '../config';
import useRefresh from './useRefresh';

const useStatsForPool = (bank: Bank) => {
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  useEffect(() => {
    async function fetchAPRsForPool() {
      try {
        setPoolAPRs(await polarisFinance.getPoolAPRs(bank));
      } catch (err) {
        console.error(err);
      }
    }
    fetchAPRsForPool();
  }, [setPoolAPRs, polarisFinance, bank, slowRefresh]);

  return poolAPRs;
};

export default useStatsForPool;
