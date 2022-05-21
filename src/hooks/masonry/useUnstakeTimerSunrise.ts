import { useEffect, useState } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import { AllocationTime } from '../../polaris-finance/types';

const useUnstakeTimerMasonry = (sunrise) => {
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
  }, [polarisFinance, sunrise?.earnTokenName]);
  return time;
};

export default useUnstakeTimerMasonry;
