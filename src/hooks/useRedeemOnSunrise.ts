import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (token: string, description?: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem SPOLAR from SUNRISE';
    handleTransactionReceipt(polarisFinance.exitFromSunrise(token), alertDesc);
  }, [polarisFinance, description, handleTransactionReceipt, token]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
