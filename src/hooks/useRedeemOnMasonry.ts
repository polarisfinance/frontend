import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (description?: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem SPOLAR from SUNRISE';
    handleTransactionReceipt(polarisFinance.exitFromMasonry(), alertDesc);
  }, [polarisFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
