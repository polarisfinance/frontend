import { useEffect, useState } from 'react';
import usePolarisFinance from './../usePolarisFinance';
import useRefresh from '../useRefresh';
import { Sunrise } from '../../polaris-finance';

const useWithdrawCheck = (sunrise:Sunrise) => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await polarisFinance.canUserUnstakeFromSunrise(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, polarisFinance, slowRefresh, sunrise]);

  return canWithdraw;
};

export default useWithdrawCheck;
