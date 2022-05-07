import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = (token: string) => {
  const [stat, setStat] = useState<string>();
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await polarisFinance.getTokenEstimatedTWAP(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, polarisFinance, slowRefresh, token]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
