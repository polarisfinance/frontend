import { useCallback } from 'react';
import usePolarisFinance from './usePolarisFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useClaimRewardFromSunrise = (token: string) => {
  const polarisFinance = usePolarisFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(polarisFinance.claimRewardFromSunrise(token), `Claim ${token} from Sunrise`);
  }, [polarisFinance, handleTransactionReceipt, token]);

  return { onReward: handleReward };
};

export default useClaimRewardFromSunrise;
