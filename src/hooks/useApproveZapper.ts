import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../polaris-finance/ERC20';
import { FTM_TICKER, POLAR_TICKER, SPOLAR_TICKER } from '../utils/constants';
import usePolarisFinance from './usePolarisFinance';
import { WETH } from '@trisolaris/sdk';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveZapper(zappingToken: string): [ApprovalState, () => Promise<void>] {
  const polarisFinance = usePolarisFinance();
  let token: ERC20 = polarisFinance.externalTokensMetamask[zappingToken];
  if (zappingToken === 'ETH') token = polarisFinance.externalTokensMetamask['WETH'];

  const pendingApproval = useHasPendingApproval(token.address, polarisFinance.contracts['zapper'].address);
  const currentAllowance = useAllowance(token, polarisFinance.contracts['zapper'].address, pendingApproval);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    if (zappingToken === 'ETH') return ApprovalState.APPROVED;
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [currentAllowance, pendingApproval, token, polarisFinance]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    const response = await token.approve(polarisFinance.contracts['zapper'].address, APPROVE_AMOUNT);
    addTransaction(response, {
      summary: `Approve ${token.symbol}`,
      approval: {
        tokenAddress: token.address,
        spender: polarisFinance.contracts['zapper'].address,
      },
    });
  }, [approvalState, token, addTransaction]);

  return [approvalState, approve];
}

export default useApproveZapper;
