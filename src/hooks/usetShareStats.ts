import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await polarisFinance.getShareStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, polarisFinance, slowRefresh]);

  return stat;
};

export default useShareStats;
