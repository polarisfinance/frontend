import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import usePolarisFinance from './../usePolarisFinance';

const useClaimRewardCheck = (sunrise) => {
  const { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await polarisFinance.canUserClaimRewardFromSunrise(sunrise));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, polarisFinance, sunrise?.earnTokenName]);

  return canClaimReward;
};

export default useClaimRewardCheck;
