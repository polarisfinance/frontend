import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';
import { Sunrise } from '../../polaris-finance';

const useClaimRewardTimerSunrise = (sunrise:Sunrise) => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchUserClaimRewardTime() {
      try {
        setTime(await polarisFinance.getUserClaimRewardTime(sunrise));
      } catch (e) {
        console.error(e);
      }
    }
    if (polarisFinance) {
      fetchUserClaimRewardTime();
    }
  }, [polarisFinance, sunrise]);
  return time;
};

export default useClaimRewardTimerSunrise;
