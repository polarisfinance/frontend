import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (sunrise, description?: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem SPOLAR from SUNRISE';
    handleTransactionReceipt(polarisFinance.exitFromSunrise(sunrise), alertDesc);
  }, [polarisFinance, description, handleTransactionReceipt, sunrise]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
