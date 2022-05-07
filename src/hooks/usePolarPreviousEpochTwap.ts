import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const usePolarPreviousEpochTwap = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchPolarPreviousEpochTwap() {
      try {
        setBalance(await polarisFinance.getPolarPreviousEpochTwap());
      } catch (err) {
        console.error(err);
      }
    }
    fetchPolarPreviousEpochTwap();
  }, [setBalance, polarisFinance]);

  return balance;
};

export default usePolarPreviousEpochTwap;
