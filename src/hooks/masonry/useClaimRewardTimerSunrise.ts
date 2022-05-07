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
    if (polarisFinance) {
      polarisFinance.getUserClaimRewardTime(token).then(setTime);
    }
  }, [polarisFinance, token]);
  return time;
};

export default useClaimRewardTimerSunrise;
