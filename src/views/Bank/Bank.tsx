import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Typography, Grid } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../polaris-finance';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
  },
  text: {
    fontSize: '22px',
  },
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams<{ bankId: string }>();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  return account && bank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      {bank.depositTokenName.endsWith('ETH') && <TaxFeeAlert />}
      {bank.depositTokenName.startsWith('POLAR-LUNAR') && (
        <Alert
          style={{ marginTop: '0px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
          variant="filled"
          severity="warning"
        >
          <b>This pool has been retired. Please unstake and collect your rewards.</b>
        </Alert>
      )}
      <Grid container>
        <Grid item xs={12} md={4}>
          {<Stake bank={bank} />}
        </Grid>
        <Grid container item xs={12} md={4} alignItems="center" direction="row">
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>APR:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>
                {bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>Daily APR:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>
                {bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>TVL:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>${statsOnPool?.TVL}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Harvest bank={bank} />
        </Grid>
        <Grid item xs={12}>
          <StyledBank>
            {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
            {bank.depositTokenName.startsWith('POLAR-STNEAR') && (
              <Box style={{ marginTop: '10px' }}>
                <StyledLink href={'https://metapool.app/dapp/mainnet/metapool-aurora/'} target="_blank">
                  Get STNEAR ↗
                </StyledLink>
              </Box>
            )}
            {bank.depositTokenName.startsWith('ETH') && (
              <Box style={{ marginTop: '10px' }}>
                <StyledLink
                  href={
                    'https://wannaswap.finance/exchange/swap/swap?inputCurrency=ETH&outputCurrency=0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'
                  }
                  target="_blank"
                >
                  Get WETH ↗
                </StyledLink>
              </Box>
            )}
            <div style={{ marginTop: '20px' }}>
              <Button onClick={onRedeem} color="primary" variant="contained">
                Claim & Withdraw
              </Button>
            </div>
          </StyledBank>
        </Grid>
      </Grid>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const polarisFinance = usePolarisFinance();
  const tombAddr = polarisFinance.POLAR.address;
  const tshareAddr = polarisFinance.SPOLAR.address;
  const lunarAddr = polarisFinance.LUNAR.address;
  const tripolarAddr = polarisFinance.TRIPOLAR.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName === 'POLAR-NEAR-LP') {
    pairName = 'POLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tombAddr;
  } else if (bank.depositTokenName === 'SPOLAR-NEAR-LP') {
    pairName = 'SPOLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tshareAddr;
  } else if (bank.depositTokenName === 'POLAR-STNEAR-LP') {
    pairName = 'POLAR-STNEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30/' + tombAddr;
  } else if (bank.depositTokenName === 'LUNAR-LUNA-LP') {
    pairName = 'LUNAR-LUNA pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096/' + lunarAddr;
  } else if (bank.depositTokenName === 'POLAR-LUNAR-LP') {
    pairName = 'POLAR-LUNAR-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/' + tombAddr + '/' + lunarAddr;
  } else {
    pairName = 'TRIPOLAR-xTRI pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0x802119e4e253D5C19aA06A5d567C5a41596D6803/' + tripolarAddr;
  }

  return (
    <StyledLink style={{ marginTop: '20px' }} href={uniswapUrl} target="_blank">
      {`Provide liquidity for ${pairName} now on Trisolaris`}
    </StyledLink>
  );
};

const TaxFeeAlert: React.FC = () => {
  return (
    <Alert
      style={{ marginTop: '0px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
      variant="filled"
      severity="warning"
    >
      <b>This Pool has 1% fee on deposit.</b>
    </Alert>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: white;
  text-decoration: underline;
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
