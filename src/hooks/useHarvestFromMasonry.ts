import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromMasonry = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(polarisFinance.harvestCashFromMasonry(), 'Claim POLAR from Sunrise');
  }, [polarisFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromMasonry;
