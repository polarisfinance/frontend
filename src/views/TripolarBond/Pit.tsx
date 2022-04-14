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
import useBondStats from '../../hooks/useTripolarBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAPTripolar';
import useCashPriceInPreviousTWAP from '../../hooks/useCashPriceInPreviousTWAPTripolar';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasableTripolar';
import useBondsRedeemable from '../../hooks/useBondsRedeemableTripolar';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';
import HomeImage from '../../assets/img/home.png';
import usePolarPreviousEpochTwap from '../../hooks/useTripolarPreviousEpochTwap';
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
  const tombFinance = useTombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const previousTwap = useCashPriceInPreviousTWAP();
  const bondsPurchasable = useBondsPurchasable();
  const bondsRedeemable = useBondsRedeemable();
  const bondBalance = useTokenBalance(tombFinance?.TRIBOND);
  const polarPreviousEpochTwap = usePolarPreviousEpochTwap();

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.buyTripolarBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} TRIBOND with ${amount} TRIPOLAR`,
      });
    },
    [tombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.redeemTripolarBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} TRIBOND` });
    },
    [tombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => previousTwap.gt(BOND_REDEEM_PRICE_BN), [previousTwap]);
  const isBondPurchasable = useMemo(
    () => Number(getDisplayBalance(polarPreviousEpochTwap, 18, 4)) < 1.01,
    [polarPreviousEpochTwap],
  );

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
                  fromToken={tombFinance.TRIPOLAR}
                  fromTokenName="TRIPOLAR"
                  toToken={tombFinance.TRIBOND}
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
                  price={getDisplayBalance(polarPreviousEpochTwap, 18, 4)}
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
                  fromToken={tombFinance.TRIBOND}
                  fromTokenName="TRIBOND"
                  toToken={tombFinance.TRIPOLAR}
                  toTokenName="TRIPOLAR"
                  priceDesc={`${getDisplayBalance(bondsRedeemable)} TRIBOND Redeemable`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when TRIPOLAR > ${BOND_REDEEM_PRICE}XTRI` : null}
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
