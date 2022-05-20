import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import { Sunrise } from '../../polaris-finance';
import config, { sunriseDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [sunrises, setSunrises] = useState<Sunrise[]>([]);
  const polarisFinance = usePolarisFinance();
  const isUnlocked = polarisFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const sunrises: Sunrise[] = [];

    for (const sunriseInfo of Object.values(sunriseDefinitions)) {
      sunrises.push({
        ...sunriseInfo,
        address: config.deployments[sunriseInfo.contract].address,
      });
    }
    sunrises.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setSunrises(sunrises);
  }, [setSunrises]);

  useEffect(() => {
    if (polarisFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, polarisFinance, fetchPools]);

  return <Context.Provider value={{ sunrises }}>{children}</Context.Provider>;
};

export default Banks;
