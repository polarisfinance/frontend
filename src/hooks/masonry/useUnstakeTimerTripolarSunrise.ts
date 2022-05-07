import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';

const useUnstakeTimerLunarSunrise = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    if (polarisFinance) {
      polarisFinance.getUserUnstakeTimeTripolarSunrise().then(setTime);
    }
  }, [polarisFinance]);
  return time;
};

export default useUnstakeTimerLunarSunrise;
