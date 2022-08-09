import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AcBank } from '../polaris-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { BigNumber } from 'ethers';

const useWithdraw = (bank: AcBank) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: BigNumber) => {
      handleTransactionReceipt(
        polarisFinance.withdraw(bank.contract, amount),
        `Withdraw ${amount.div(BigNumber.from(10).pow(18))} ${bank.depositTokenName} from ${bank.contract}`,
      );
    },
    [bank, polarisFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
