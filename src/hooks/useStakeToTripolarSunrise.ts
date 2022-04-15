import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToLunarSunrise = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        tombFinance.stakeShareToTripolarSunrise(amount),
        `Stake ${amount} SPOLAR to the TRIPOLAR Sunrise`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToLunarSunrise;
