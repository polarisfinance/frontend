import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await polarisFinance.getBondsPurchasable());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, polarisFinance]);

  return balance;
};

export default useBondsPurchasable;
