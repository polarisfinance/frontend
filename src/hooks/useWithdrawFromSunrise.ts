import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Sunrise } from '../polaris-finance';

const useWithdrawFromSunrise = (sunrise: Sunrise) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.withdrawSpolarFromSunrise(amount, sunrise),
        `Withdraw ${amount} SPOLAR from the ${sunrise.earnTokenName} SUNRISE`,
      );
    },
    [polarisFinance, handleTransactionReceipt, sunrise],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromSunrise;
