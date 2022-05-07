import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useTombStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchTombPrice() {
      try {
        setStat(await polarisFinance.getTombStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTombPrice();
  }, [setStat, polarisFinance, fastRefresh]);

  return stat;
};

export default useTombStats;
