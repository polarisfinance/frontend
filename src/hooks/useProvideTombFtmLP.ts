import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from './../utils/constants';

const useProvideTombFtmLP = () => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideTombFtmLP = useCallback(
    (ftmAmount: string, tombAmount: string) => {
      const tombAmountBn = parseUnits(tombAmount);
      handleTransactionReceipt(
        polarisFinance.provideTombFtmLP(ftmAmount, tombAmountBn),
        `Provide POLAR-NEAR LP ${tombAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [polarisFinance, handleTransactionReceipt],
  );
  return { onProvideTombFtmLP: handleProvideTombFtmLP };
};

export default useProvideTombFtmLP;
