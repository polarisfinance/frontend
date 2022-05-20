import { useCallback } from 'react';
import usePolarisFinance from '../usePolarisFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapTBondToTShare = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapTShare = useCallback(
    (tbondAmount: string) => {
      const tbondAmountBn = parseUnits(tbondAmount, 18);
      handleTransactionReceipt(polarisFinance.swapTBondToTShare(tbondAmountBn), `Swap ${tbondAmount} TBond to TShare`);
    },
    [polarisFinance, handleTransactionReceipt],
  );
  return { onSwapTShare: handleSwapTShare };
};

export default useSwapTBondToTShare;
