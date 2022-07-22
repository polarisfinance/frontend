import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import usePolarisFinance from './usePolarisFinance';
import { ContractName } from '../polaris-finance';
import useRefresh from './useRefresh';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = polarisFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await polarisFinance.earnedFromBank(poolName, earnTokenName, poolId, polarisFinance.myAccount));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [poolName, polarisFinance, earnTokenName, poolId, slowRefresh, isUnlocked]);

  return balance;
};

export default useEarnings;
