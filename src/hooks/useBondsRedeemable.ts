import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const useBondsRedeemable = (token: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsRedeemable() {
      try {
        setBalance(await polarisFinance.getBondsRedeemable(token));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsRedeemable();
  }, [setBalance, polarisFinance, token]);

  return balance;
};

export default useBondsRedeemable;
