import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAPTripolar = () => {
  const [stat, setStat] = useState<TokenStat>();
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await tombFinance.getTripolarStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, tombFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAPTripolar;
