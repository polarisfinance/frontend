import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useTombFinance from '../../hooks/useTombFinance';
import TokenSymbol from '../TokenSymbol';
import { Grid } from '@material-ui/core';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const tombFinance = useTombFinance();

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);

  const tbondBalance = useTokenBalance(tombFinance.TBOND);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);

  const lunarBalance = useTokenBalance(tombFinance.LUNAR);
  const displayLunarBalance = useMemo(() => getDisplayBalance(lunarBalance), [lunarBalance]);

  const lbondBalance = useTokenBalance(tombFinance.LBOND);
  const displayLbondBalance = useMemo(() => getDisplayBalance(lbondBalance), [lbondBalance]);

  return (
    <Modal>
      <ModalTitle text="My Wallet" />

      <Grid container justify="center">
        <StyledBalanceWrapper>
          <TokenSymbol symbol="POLAR" />
          <StyledBalance>
            <StyledValue>{displayTombBalance}</StyledValue>
            <Label text="POLAR Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="SPOLAR" />
          <StyledBalance>
            <StyledValue>{displayTshareBalance}</StyledValue>
            <Label text="SPOLAR Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="PBOND" />
          <StyledBalance>
            <StyledValue>{displayTbondBalance}</StyledValue>
            <Label text="PBOND Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="LUNAR" />
          <StyledBalance>
            <StyledValue>{displayLunarBalance}</StyledValue>
            <Label text="LUNAR Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="LBOND" />
          <StyledBalance>
            <StyledValue>{displayLbondBalance}</StyledValue>
            <Label text="LBOND Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Grid>
    </Modal>
  );
};

const StyledValue = styled.div`
  //color: rgba(71,32,123,0.9);
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 16px;
`;

export default AccountModal;
