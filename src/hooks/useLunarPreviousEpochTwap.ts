import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';

const usePolarPreviousEpochTwap = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchPolarPreviousEpochTwap() {
      try {
        setBalance(await tombFinance.getLunarPreviousEpochTwap());
      } catch (err) {
        console.error(err);
      }
    }
    fetchPolarPreviousEpochTwap();
  }, [setBalance, tombFinance]);

  return balance;
};

export default usePolarPreviousEpochTwap;
