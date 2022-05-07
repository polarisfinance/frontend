import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.stakeShareToMasonry(amount),
        `Stake ${amount} SPOLAR to the POLAR Sunrise`,
      );
    },
    [polarisFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
