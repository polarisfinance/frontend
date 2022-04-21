import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromLunarSunrise = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        tombFinance.withdrawShareFromTripolarSunrise(amount),
        `Withdraw ${amount} SPOLAR from the SUNRISE`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromLunarSunrise;
