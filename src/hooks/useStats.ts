import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useStats = (token: string) => {
  const [state, setState] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const polarisFinance = usePolarisFinance();
  useEffect(() => {
    async function fetchStats() {
      try {
        setState(await polarisFinance.getStat(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [setState, polarisFinance, fastRefresh, token]);

  return state;
};

export default useStats;
