import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button, Card, CardContent } from '@material-ui/core';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useDeposit from '../../../hooks/useDeposit';
import useZap from '../../../hooks/useZap';
import useDepositedBalance from '../../../hooks/useDepositedBalance';
import useDepositedShares from '../../../hooks/useDepositedShares';
import useMutiplyerAc from '../../../hooks/useMutiplyerAc';

import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawAc from '../../../hooks/useWithdrawAc';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { AcBank } from '../../../polaris-finance';

interface StakeProps {
  bank: AcBank;
}

const Stake: React.FC<StakeProps> = ({ bank }) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  //const { color: themeColor } = useContext(ThemeContext);
  const multiplyer = useMutiplyerAc(bank.contract);
  const stakedShareBalance = useDepositedShares(bank.contract);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useDepositedBalance(bank.contract);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal, 18))
  ).toFixed(2);
  const { onDeposit } = useDeposit(bank);
  // const { onZap } = useZap(bank);
  const { onWithdraw } = useWithdrawAc(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onDeposit(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  // const [onDissmissZap] = useModal(
  //   <ZapModal
  //     decimals={bank.depositToken.decimal}
  //     onConfirm={(zappingToken, tokenName, amount) => {
  //       if (Number(amount) <= 0 || isNaN(Number(amount))) return;
  //       onZap(zappingToken, tokenName, amount);
  //       onDissmissZap();
  //     }}
  //     tokenName={bank.depositTokenName}
  //   />,
  // );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      multiplyer={multiplyer}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.depositToken.symbol} />
            </CardIcon>
            {bank.depositTokenName.startsWith('ORBITAL') || bank.depositTokenName.startsWith('USP') ? (
              <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal, 8)} />
            ) : (
              <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} />
            )}
            <Label text={`≈ $${earnedInDollars}`} />
            <Label text={`${bank.depositTokenName} Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={
                  bank.closedForStaking ||
                  approveStatus === ApprovalState.PENDING ||
                  approveStatus === ApprovalState.UNKNOWN
                }
                onClick={approve}
                color="primary"
                variant="contained"
                style={{ marginTop: '20px' }}
              >
                {`Approve ${bank.depositTokenName}`}
              </Button>
            ) : (
              <>
                <IconButton onClick={onPresentWithdraw}>
                  <RemoveIcon />
                </IconButton>
                <StyledActionSpacer />

                <StyledActionSpacer />
                <IconButton
                  disabled={bank.closedForStaking}
                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                >
                  <AddIcon />
                </IconButton>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
