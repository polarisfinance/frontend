import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useStats from '../../hooks/useStats';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import useTokenPriceInLastTWAP from '../../hooks/useTokenPriceInLastTWAP';
import useTokenPreviousEpochTWAP from '../../hooks/useTokenPreviousEpochTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsRedeemable from '../../hooks/useBondsRedeemable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../polaris-finance/constants';
import HomeImage from '../../assets/img/home.png';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
`;

const Pit: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const polarisFinance = usePolarisFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useStats('TRIBOND');
  const cashPrice = useTokenPriceInLastTWAP('TRIPOLAR');
  const previousTwap = useTokenPreviousEpochTWAP('TRIPOLAR');
  const bondsRedeemable = useBondsRedeemable('TRIPOLAR');
  const bondBalance = useTokenBalance(polarisFinance?.TRIBOND);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.buyBonds(amount, 'TRIPOLAR');
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} TRIBOND with ${amount} TRIPOLAR`,
      });
    },
    [polarisFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.redeemBonds(amount, 'TRIPOLAR');
      addTransaction(tx, { summary: `Redeem ${amount} TRIBOND` });
    },
    [polarisFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => previousTwap.gt(BOND_REDEEM_PRICE_BN), [previousTwap]);
  const isBondPurchasable = useMemo(() => Number(getDisplayBalance(previousTwap, 18, 4)) < 1.01, [previousTwap]);

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="Buy & Redeem Bonds" subtitle="Earn premiums upon redemption" />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={polarisFinance.TRIPOLAR}
                  fromTokenName="TRIPOLAR"
                  toToken={polarisFinance.TRIBOND}
                  toTokenName="TRIBOND"
                  priceDesc={!isBondPurchasable ? 'TRIPOLAR is over peg' : 'TRIBOND is available for purchase'}
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="TRIPOLAR"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="TRIPOLAR"
                  description="Previous Epoch TWAP Price"
                  price={getDisplayBalance(previousTwap, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="TRIBOND"
                  description="Current Price: (TRIPOLAR)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={polarisFinance.TRIBOND}
                  fromTokenName="TRIBOND"
                  toToken={polarisFinance.TRIPOLAR}
                  toTokenName="TRIPOLAR"
                  priceDesc={`${getDisplayBalance(bondsRedeemable)} TRIBOND Redeemable`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when TRIPOLAR > ${BOND_REDEEM_PRICE}xTRI` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
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
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Pit;
