import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();

  useEffect(() => {
    if (polarisFinance) {
      const { Treasury } = polarisFinance.contracts;
      polarisFinance.POLAR.balanceOf(Treasury.address).then(setAmount);
    }
  }, [polarisFinance]);
  return amount;
};

export default useTreasuryAmount;
