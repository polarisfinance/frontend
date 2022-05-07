import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToLunarSunrise = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.stakeShareToLunarSunrise(amount),
        `Stake ${amount} SPOLAR to the LUNAR Sunrise`,
      );
    },
    [polarisFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToLunarSunrise;
