import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';

const useUnstakeTimerMasonry = (token: string) => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    async function fetchUserUnstakeTime() {
      try {
        setTime(await polarisFinance.getUserUnstakeTime(token));
      } catch (e) {
        console.error(e);
      }
    }

    if (polarisFinance) {
      fetchUserUnstakeTime();
    }
  }, [polarisFinance, token]);
  return time;
};

export default useUnstakeTimerMasonry;
