import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import { AcBank } from '../../polaris-finance';
import { acBankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [acBanks, setBanks] = useState<AcBank[]>([]);
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const acBanks: AcBank[] = [];

    for (const bankInfo of Object.values(acBankDefinitions)) {
      if (bankInfo.finished) {
        if (!polarisFinance.isUnlocked) continue;
      }
      acBanks.push({
        ...bankInfo,
        address: polarisFinance.contracts[bankInfo.contract].address,
        depositToken: polarisFinance.externalTokensMetamask[bankInfo.depositTokenName],
      });
    }
    acBanks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(acBanks);
  }, [polarisFinance, setBanks]);

  useEffect(() => {
    if (polarisFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, polarisFinance, fetchPools]);

  return <Context.Provider value={{ acBanks }}>{children}</Context.Provider>;
};

export default Banks;
