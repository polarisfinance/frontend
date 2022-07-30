import { useState, useEffect } from 'react';
import usePolarisFinance from './usePolarisFinance';
import { AcBank } from '../polaris-finance';
import { PoolStats } from '../polaris-finance/types';
import useRefresh from './useRefresh';
import useBank from '../hooks/useBank';

const useStatsForVault = (acBank: AcBank) => {
  const polarisFinance = usePolarisFinance();
  const { slowRefresh } = useRefresh();
  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();
  const bank = useBank(acBank.bankName);

  useEffect(() => {
    async function fetchAPRsForPool() {
      try {
        setPoolAPRs(await polarisFinance.getVaultStats(bank, acBank));
      } catch (err) {
        console.error(err);
      }
    }
    fetchAPRsForPool();
  }, [setPoolAPRs, polarisFinance, bank, slowRefresh]);

  return poolAPRs;
};

export default useStatsForVault;
