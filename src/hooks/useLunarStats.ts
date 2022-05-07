import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useLunarStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchLunarPrice() {
      try {
        setStat(await polarisFinance.getLunarStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchLunarPrice();
  }, [setStat, polarisFinance, fastRefresh]);

  return stat;
};

export default useLunarStats;
