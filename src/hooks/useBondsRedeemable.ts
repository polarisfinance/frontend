import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import { Sunrise } from '../polaris-finance';

const useBondsRedeemable = (sunrise: Sunrise) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsRedeemable() {
      try {
        setBalance(await polarisFinance.getBondsRedeemable(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsRedeemable();
  }, [setBalance, polarisFinance, sunrise]);

  return balance;
};

export default useBondsRedeemable;
