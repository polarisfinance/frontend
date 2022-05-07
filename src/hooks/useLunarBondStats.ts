import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await polarisFinance.getLunarBondStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, polarisFinance, slowRefresh]);

  return stat;
};

export default useBondStats;
