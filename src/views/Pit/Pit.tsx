import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import useBondsRedeemable from '../../hooks/useBondsRedeemable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';
import HomeImage from '../../assets/img/home.png'
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Pit: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();
  const bondsRedeemable = useBondsRedeemable();

  const bondBalance = useTokenBalance(tombFinance?.TBOND);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} Polar with ${amount} POLAR`,
      });
    },
    [tombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} PBOND` });
    },
    [tombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);

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
                  fromToken={tombFinance.TOMB}
                  fromTokenName="POLAR"
                  toToken={tombFinance.TBOND}
                  toTokenName="PBOND"
                  priceDesc={
                    !isBondPurchasable
                      ? 'POLAR is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' PBOND available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="POLAR"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="PBOND"
                  description="Current Price: (POLAR)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={tombFinance.TBOND}
                  fromTokenName="PBOND"
                  toToken={tombFinance.TOMB}
                  toTokenName="POLAR"
                  priceDesc={`${getDisplayBalance(bondsRedeemable)} PBOND Redeemable`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when POLAR > ${BOND_REDEEM_PRICE}NEAR` : null}
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
