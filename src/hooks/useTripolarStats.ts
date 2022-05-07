import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useTripolarStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchTripolarPrice() {
      try {
        setStat(await polarisFinance.getTripolarStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTripolarPrice();
  }, [setStat, polarisFinance, fastRefresh]);

  return stat;
};

export default useTripolarStats;
