import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromSunrise = (token: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.withdrawSpolarFromSunrise(amount, token),
        `Withdraw ${amount} SPOLAR from the ${token} SUNRISE`,
      );
    },
    [polarisFinance, handleTransactionReceipt, token],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromSunrise;
