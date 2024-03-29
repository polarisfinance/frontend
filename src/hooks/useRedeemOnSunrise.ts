import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Sunrise } from '../polaris-finance';

const useRedeemOnMasonry = (sunrise: Sunrise, description?: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || `Redeem SPOLAR from ${sunrise.earnTokenName} SUNRISE`;
    handleTransactionReceipt(polarisFinance.exitFromSunrise(sunrise), alertDesc);
  }, [polarisFinance, description, handleTransactionReceipt, sunrise]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
