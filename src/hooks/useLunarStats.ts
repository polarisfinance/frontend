import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useLunarStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchLunarPrice() {
      try {
        setStat(await tombFinance.getLunarStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchLunarPrice();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useLunarStats;
