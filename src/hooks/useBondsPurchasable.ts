import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const useBondsPurchasable = (token: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await polarisFinance.getBondsPurchasable(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, polarisFinance, token]);

  return balance;
};

export default useBondsPurchasable;
