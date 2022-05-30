import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import { Bank } from '../../polaris-finance';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!polarisFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await polarisFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          polarisFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: polarisFinance.externalTokensMetamask[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'POLAR' ? polarisFinance.POLAR : polarisFinance.SPOLAR,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [polarisFinance, setBanks]);

  useEffect(() => {
    if (polarisFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, polarisFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
