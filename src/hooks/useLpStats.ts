import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { LPStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await polarisFinance.getLPStat(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, polarisFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
