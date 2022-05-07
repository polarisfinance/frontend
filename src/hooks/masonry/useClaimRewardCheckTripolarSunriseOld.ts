import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import usePolarisFinance from '../usePolarisFinance';

const useClaimRewardCheck = () => {
  const { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await polarisFinance.canUserClaimRewardFromTripolarSunriseOld());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, polarisFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
