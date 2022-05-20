import { useEffect, useState } from 'react';
import usePolarisFinance from './../usePolarisFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = (token: string) => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await polarisFinance.canUserUnstakeFromSunrise(token));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, polarisFinance, slowRefresh, token]);

  return canWithdraw;
};

export default useWithdrawCheck;
