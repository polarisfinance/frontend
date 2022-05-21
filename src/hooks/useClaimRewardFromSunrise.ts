import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Sunrise } from '../polaris-finance';

const useClaimRewardFromSunrise = (sunrise:Sunrise) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(polarisFinance.claimRewardFromSunrise(sunrise), `Claim ${sunrise?.earnTokenName} from Sunrise`);
  }, [polarisFinance, handleTransactionReceipt, sunrise]);

  return { onReward: handleReward };
};

export default useClaimRewardFromSunrise;
