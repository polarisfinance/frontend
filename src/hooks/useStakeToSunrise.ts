import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = (sunrise) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.stakeSpolarToSunrise(amount, sunrise),
        `Stake ${amount} SPOLAR to the ${sunrise?.earnTokenName} Sunrise`,
      );
    },
    [polarisFinance, handleTransactionReceipt, sunrise?.earnTokenName],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
