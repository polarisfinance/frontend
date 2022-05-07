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
import useBondStats from '../../hooks/useLunarBondStats';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAPLunar';
import useCashPriceInPreviousTWAP from '../../hooks/useCashPriceInPreviousTWAPLunar';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsRedeemable from '../../hooks/useBondsRedeemableLunar';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../polaris-finance/constants';
import HomeImage from '../../assets/img/home.png';
import usePolarPreviousEpochTwap from '../../hooks/useLunarPreviousEpochTwap';
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
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const previousTwap = useCashPriceInPreviousTWAP();
  const bondsRedeemable = useBondsRedeemable();
  const bondBalance = useTokenBalance(polarisFinance?.LBOND);
  const polarPreviousEpochTwap = usePolarPreviousEpochTwap();

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.buyLunarBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} LBOND with ${amount} LUNAR`,
      });
    },
    [polarisFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.redeemLunarBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} LBOND` });
    },
    [polarisFinance, addTransaction],
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
                  fromToken={polarisFinance.LUNAR}
                  fromTokenName="LUNAR"
                  toToken={polarisFinance.LBOND}
                  toTokenName="LBOND"
                  priceDesc={!isBondPurchasable ? 'LUNAR is over peg' : 'LBOND is available for purchase'}
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="LUNAR"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="LUNAR"
                  description="Previous Epoch TWAP Price"
                  price={getDisplayBalance(polarPreviousEpochTwap, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="LBOND"
                  description="Current Price: (LUNAR)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={polarisFinance.LBOND}
                  fromTokenName="LBOND"
                  toToken={polarisFinance.LUNAR}
                  toTokenName="LUNAR"
                  priceDesc={`${getDisplayBalance(bondsRedeemable)} LBOND Redeemable`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when LUNAR > ${BOND_REDEEM_PRICE}LUNA` : null}
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
