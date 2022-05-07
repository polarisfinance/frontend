import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromLunarSunrise = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.withdrawShareFromLunarSunrise(amount),
        `Withdraw ${amount} SPOLAR from the SUNRISE`,
      );
    },
    [polarisFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromLunarSunrise;
