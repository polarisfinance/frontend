import { useCallback, useState, useEffect } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { Bank } from '../polaris-finance';
import { PoolStats } from '../polaris-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const polarisFinance = usePolarisFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await polarisFinance.getPoolAPRs(bank));
  }, [polarisFinance, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch ${bank.earnTokenName} price: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, polarisFinance, fetchAPRsForPool, bank]);

  return poolAPRs;
};

export default useStatsForPool;
