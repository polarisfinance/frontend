import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useTripolarStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchTripolarPrice() {
      try {
        setStat(await tombFinance.getTripolarStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTripolarPrice();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useTripolarStats;
