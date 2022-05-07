import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import TokenSymbol from '../TokenSymbol';
import { Grid } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import { Button } from '@material-ui/core';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const polarisFinance = usePolarisFinance();

  const tombBalance = useTokenBalance(polarisFinance.POLAR);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const tshareBalance = useTokenBalance(polarisFinance.SPOLAR);
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);

  const tbondBalance = useTokenBalance(polarisFinance.PBOND);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);

  const lunarBalance = useTokenBalance(polarisFinance.LUNAR);
  const displayLunarBalance = useMemo(() => getDisplayBalance(lunarBalance), [lunarBalance]);

  const lbondBalance = useTokenBalance(polarisFinance.LBOND);
  const displayLbondBalance = useMemo(() => getDisplayBalance(lbondBalance), [lbondBalance]);

  const tripolarBalance = useTokenBalance(polarisFinance.TRIPOLAR);
  const displayTripolarBalance = useMemo(() => getDisplayBalance(tripolarBalance), [tripolarBalance]);

  const tribondBalance = useTokenBalance(polarisFinance.TRIBOND);
  const displayTribondBalance = useMemo(() => getDisplayBalance(tribondBalance), [tribondBalance]);

  const { reset } = useWallet();

  return (
    <Modal>
      <ModalTitle text="My Wallet" />
      <Button
        onClick={() => {
          reset();
          onDismiss();
        }}
        variant="contained"
        style={{ position: 'absolute', top: '18px', right: '18px', backgroundColor: '#b43387' }}
      >
        Disconnect
      </Button>
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

        <StyledBalanceWrapper>
          <TokenSymbol symbol="TRIPOLAR" />
          <StyledBalance>
            <StyledValue>{displayTripolarBalance}</StyledValue>
            <Label text="TRIPOLAR Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="TRIBOND" />
          <StyledBalance>
            <StyledValue>{displayTribondBalance}</StyledValue>
            <Label text="TRIBOND Available" />
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
