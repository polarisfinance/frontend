import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnTripolarSunrise = (description?: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem SPOLAR from SUNRISE';
    handleTransactionReceipt(polarisFinance.exitFromTripolarSunrise(), alertDesc);
  }, [polarisFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnTripolarSunrise;
