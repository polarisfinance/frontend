import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { Bank } from '../polaris-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(polarisFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, polarisFinance, handleTransactionReceipt]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
