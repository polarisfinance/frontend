import { useEffect, useState } from 'react';
import useTombFinance from '../useTombFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheckLunarSunrise = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await tombFinance.canUserUnstakeFromTripolarSunrise());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheckLunarSunrise;
