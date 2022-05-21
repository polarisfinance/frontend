import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';
import { Sunrise } from '../../polaris-finance';

const useUnstakeTimerMasonry = (sunrise:Sunrise) => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchUserUnstakeTime() {
      try {
        setTime(await polarisFinance.getUserUnstakeTime(sunrise));
      } catch (e) {
        console.error(e);
      }
    }

    if (polarisFinance) {
      fetchUserUnstakeTime();
    }
  }, [polarisFinance, sunrise]);
  return time;
};

export default useUnstakeTimerMasonry;
