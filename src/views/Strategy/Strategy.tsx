import React, { /*useCallback, useEffect, */ useMemo, useState } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box, /* Paper, Typography,*/ Button, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useTombFinance from '../../hooks/useTombFinance';
import { getDisplayBalance /*, getBalance*/ } from '../../utils/formatBalance';
import { BigNumber /*, ethers*/ } from 'ethers';
import useSwapTBondToTShare from '../../hooks/TShareSwapper/useSwapTBondToTShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useTShareSwapperStats from '../../hooks/TShareSwapper/useTShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';
import Image from 'material-ui-image';
import Strategy6040 from '../../assets/img/60-40_strategy.png';
import StrategyAlive from '../../assets/img/keep_protocol_alive.png';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
`;
const Strategy: React.FC = () => {
  return (
    <Page>
      <BackgroundImage />
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '0px' }}
        src={Strategy6040}
      />
      <Image
        color="none"
        imageStyle={{ height: 'auto', position: 'relative' }}
        style={{ height: 'auto', position: 'relative', paddingTop: '48px' }}
        src={StrategyAlive}
      />
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span``;

export default Strategy;
