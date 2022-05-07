import { useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AllocationTime } from '../polaris-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = (token: string) => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const polarisFinance = usePolarisFinance();
  useEffect(() => {
    if (polarisFinance) {
      polarisFinance.getTreasuryNextAllocationTime(token).then(setTime);
    }
  }, [polarisFinance, slowRefresh, token]);
  return time;
};

export default useTreasuryAllocationTimes;
