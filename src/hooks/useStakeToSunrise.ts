import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = (token: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.stakeSpolarToSunrise(amount, token),
        `Stake ${amount} SPOLAR to the ${token} Sunrise`,
      );
    },
    [polarisFinance, handleTransactionReceipt, token],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
