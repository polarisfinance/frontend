import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromMasonry = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(polarisFinance.harvestTripolarFromTripolarSunriseOld(), 'Claim TRIPOLAR from Sunrise');
  }, [polarisFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromMasonry;
