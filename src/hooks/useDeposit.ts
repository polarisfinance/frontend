import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AcBank } from '../polaris-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useDeposit = (bank: AcBank) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleDeposit = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        polarisFinance.deposit(bank.contract, amountBn),
        `Deposit ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, polarisFinance, handleTransactionReceipt],
  );
  return { onDeposit: handleDeposit };
};

export default useDeposit;
