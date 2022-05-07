import { useCallback, useEffect, useState } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [masonryVersion, setMasonryVersion] = useState('latest');
  const polarisFinance = usePolarisFinance();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await polarisFinance.fetchMasonryVersionOfUser());
  }, [polarisFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (polarisFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [polarisFinance?.isUnlocked, stakedBalance]);

  return masonryVersion;
};

export default useMasonryVersion;
