import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';

const useClaimRewardTimerSunrise = (token: string) => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchUserClaimRewardTime() {
      try {
        setTime(await polarisFinance.getUserClaimRewardTime(token));
      } catch (e) {
        console.error(e);
      }
    }
    if (polarisFinance) {
      fetchUserClaimRewardTime();
    }
  }, [polarisFinance, token]);
  return time;
};

export default useClaimRewardTimerSunrise;
