import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AllocationTime } from '../polaris-finance/types';
import useRefresh from './useRefresh';
import { Sunrise } from '../polaris-finance';

const useTreasuryAllocationTimes = (sunrise: Sunrise) => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();
  useEffect(() => {
    if (polarisFinance) {
      polarisFinance.getTreasuryNextAllocationTime(sunrise).then(setTime);
    }
  }, [polarisFinance, slowRefresh, sunrise]);
  return time;
};

export default useTreasuryAllocationTimes;
