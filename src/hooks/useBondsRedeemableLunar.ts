import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const useBondsRedeemable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchBondsRedeemable() {
      try {
        setBalance(await polarisFinance.getBondsRedeemableLunar());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsRedeemable();
  }, [setBalance, polarisFinance]);

  return balance;
};

export default useBondsRedeemable;
