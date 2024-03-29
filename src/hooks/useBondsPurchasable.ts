import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import { Sunrise } from '../polaris-finance';

const useBondsPurchasable = (sunrise: Sunrise) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await polarisFinance.getBondsPurchasable(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, polarisFinance, sunrise]);

  return balance;
};

export default useBondsPurchasable;
