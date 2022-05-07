import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { TokenStat } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await polarisFinance.getTombStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, polarisFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
