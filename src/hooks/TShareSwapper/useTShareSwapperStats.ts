import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { TShareSwapperStat } from '../../polaris-finance/types';
import useRefresh from '../useRefresh';

const useTShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<TShareSwapperStat>();
  const { fastRefresh /*, slowRefresh*/ } = useRefresh();
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchTShareSwapperStat() {
      try {
        if (polarisFinance.myAccount) {
          setStat(await polarisFinance.getTShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTShareSwapperStat();
  }, [setStat, polarisFinance, fastRefresh, account]);

  return stat;
};

export default useTShareSwapperStats;
