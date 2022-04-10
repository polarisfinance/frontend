import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnTripolarSunrise = (description?: string) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem SPOLAR from SUNRISE';
    handleTransactionReceipt(tombFinance.exitFromTripolarSunrise(), alertDesc);
  }, [tombFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnTripolarSunrise;
