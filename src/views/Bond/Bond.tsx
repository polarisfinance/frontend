import React, { useCallback, useMemo } from 'react';

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

import { useParams } from 'react-router-dom';
import useSunrise from '../../hooks/useSunrise';

const Pit: React.FC = () => {
  const { sunriseId } = useParams<{ sunriseId: string }>();
  const sunrise = useSunrise(sunriseId);

  const { account } = useWallet();
  const polarisFinance = usePolarisFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useStats(sunrise.bond);
  const cashPrice = useTokenPriceInLastTWAP(sunrise);
  const previousTwap = useTokenPreviousEpochTWAP(sunrise);
  const bondsRedeemable = useBondsRedeemable(sunrise);

  const bondBalance = useTokenBalance(polarisFinance[sunrise.bond]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.buyBonds(amount, sunrise);
      addTransaction(tx, {
        summary: `Buy ${sunrise.bond} with ${Number(amount).toFixed(2)} ${sunrise.earnTokenName}`,
      });
    },
    [polarisFinance, addTransaction, sunrise],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await polarisFinance.redeemBonds(amount, sunrise);
      addTransaction(tx, { summary: `Redeem ${amount} ${sunrise.bond}` });
    },
    [polarisFinance, addTransaction, sunrise],
  );
  const isBondRedeemable = useMemo(() => previousTwap.gt(BOND_REDEEM_PRICE_BN), [previousTwap]);
  const isBondPurchasable = useMemo(() => Number(getDisplayBalance(previousTwap, 18, 4)) < 1.01, [previousTwap]);

  return (
    <>
      {!!account ? (
        <>
          <PageHeader icon={'🏦'} title="Buy & Redeem Bonds" subtitle="Earn premiums upon redemption" />

          <StyledBond>
            <StyledCardWrapper>
              <ExchangeCard
                action="Purchase"
                fromToken={polarisFinance[sunrise.earnTokenName + '_METAMASK']}
                fromTokenName={sunrise.earnTokenName}
                toToken={polarisFinance[sunrise.bond]}
                toTokenName={sunrise.bond}
                priceDesc={
                  !isBondPurchasable
                    ? `${sunrise.earnTokenName} is over peg`
                    : `${sunrise.bond} is available for purchase`
                }
                onExchange={handleBuyBonds}
                disabled={!bondStat || isBondRedeemable}
                treasury={sunrise.treasury}
              />
            </StyledCardWrapper>
            <StyledStatsWrapper>
              <ExchangeStat
                tokenName={sunrise.earnTokenName}
                lpToken={sunrise.lpToken}
                description="Last-Hour TWAP Price"
                price={getDisplayBalance(cashPrice, 18, 4)}
              />
              <Spacer size="md" />
              <ExchangeStat
                tokenName={sunrise.earnTokenName}
                lpToken={sunrise.lpToken}
                description="Previous Epoch TWAP Price"
                price={getDisplayBalance(previousTwap, 18, 4)}
              />
              <Spacer size="md" />
              <ExchangeStat
                tokenName={sunrise.bond}
                lpToken={sunrise.lpToken}
                description={`Current Price: (${sunrise.earnTokenName})^2`}
                price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
              />
            </StyledStatsWrapper>
            <StyledCardWrapper>
              <ExchangeCard
                action="Redeem"
                fromToken={polarisFinance[sunrise.bond + '_METAMASK']}
                fromTokenName={sunrise.bond}
                toToken={polarisFinance[sunrise.earnTokenName]}
                toTokenName={sunrise.earnTokenName}
                priceDesc={`${getDisplayBalance(bondsRedeemable)} ${sunrise.bond} Redeemable`}
                onExchange={handleRedeemBonds}
                disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                disabledDescription={
                  !isBondRedeemable ? `Enabled when ${sunrise.earnTokenName} > ${BOND_REDEEM_PRICE}NEAR` : null
                }
                treasury={sunrise.treasury}
              />
            </StyledCardWrapper>
          </StyledBond>
        </>
      ) : (
        <UnlockWallet />
      )}
    </>
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
