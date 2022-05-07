import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AllocationTime } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();
  useEffect(() => {
    if (polarisFinance) {
      polarisFinance.getLunarTreasuryNextAllocationTime().then(setTime);
    }
  }, [polarisFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
