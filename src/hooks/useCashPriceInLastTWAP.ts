import { useCallback, useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await polarisFinance.getTombPriceInLastTWAP());
  }, [polarisFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch POLAR price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, polarisFinance, fetchCashPrice]);
  return price;
};

export default useCashPriceInLastTWAP;
