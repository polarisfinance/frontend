import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Sunrise } from '../polaris-finance';

const useStakeToMasonry = (sunrise:Sunrise) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        polarisFinance.stakeSpolarToSunrise(amount, sunrise),
        `Stake ${amount} SPOLAR to the ${sunrise?.earnTokenName} Sunrise`,
      );
    },
    [polarisFinance, handleTransactionReceipt, sunrise],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
