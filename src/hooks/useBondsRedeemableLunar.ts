import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';

const useBondsRedeemable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchBondsRedeemable() {
      try {
        setBalance(await tombFinance.getBondsRedeemableLunar());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsRedeemable();
  }, [setBalance, tombFinance]);

  return balance;
};

export default useBondsRedeemable;
