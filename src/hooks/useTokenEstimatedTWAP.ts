import { useEffect, useState } from 'react';
import { Sunrise } from '../polaris-finance';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = (sunrise:Sunrise) => {
  const [stat, setStat] = useState<string>();
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await polarisFinance.getTokenEstimatedTWAP(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, polarisFinance, slowRefresh, sunrise]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
