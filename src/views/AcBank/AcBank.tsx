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
import useAcBank from '../../hooks/useAcBank';

import useStatsForVault from '../../hooks/useStatsForVault';
import useRedeem from '../../hooks/useRedeem';
import { AcBank as BankEntity } from '../../polaris-finance';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
  },
  text: {
    fontSize: '22px',
    color: '#fff',
  },
}));

const AcBank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { acBankId } = useParams<{ acBankId: string }>();

  const acBank = useAcBank(acBankId);
  const { account } = useWallet();
  // const { onRedeem } = useRedeem(acBank);
  const statsOnPool = useStatsForVault(acBank);
  return account && acBank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${acBank?.depositTokenName} to an autocompounder `}
        title={acBank?.name}
      />
      {acBank.depositTokenName.endsWith('USDC') && <TaxFeeAlert />}
      {acBank.depositTokenName.endsWith('USDT') && <TaxFeeAlert />}
      {acBank.depositTokenName.endsWith('USN') && <TaxFeeAlert />}
      {acBank.depositTokenName.endsWith('BNB') && <TaxFeeAlert />}
      {acBank.depositTokenName.startsWith('POLAR-LUNAR') && (
        <Alert
          style={{ marginTop: '0px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
          variant="filled"
          severity="warning"
        >
          <b>This pool has been retired. Please unstake and collect your rewards.</b>
        </Alert>
      )}
      {acBank.depositTokenName.startsWith('TRIPOLAR-x') && (
        <Alert
          style={{ marginTop: '0px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
          variant="filled"
          severity="warning"
        >
          <b>This pool has been retired. Please unstake and move to new TRIPOLAR/TRI pool.</b>
        </Alert>
      )}
      <Grid container>
        <Grid item md={2} />
        <Grid item xs={12} md={4}>
          {<Stake bank={acBank} />}
        </Grid>
        <Grid container item xs={12} md={4} alignItems="center" direction="row">
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>APY:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>
                {acBank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>Daily APR:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>
                {acBank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%
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
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>Deposit FEE:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>0%</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>Withdraw FEE:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>0.1%</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>On Profits FEE:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>3.5%</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={2} />
        {/*<Grid item xs={12} md={4}>
           <Harvest acBank={acBank} />
        </Grid> */}
        <Grid item xs={12}>
          <StyledBank>
            {/* {acBank.depositTokenName.includes('LP') && <LPTokenHelpText acBank={acBank} />} */}
            {acBank.depositTokenName.startsWith('POLAR-STNEAR') && (
              <Box style={{ marginTop: '10px' }}>
                <StyledLink href={'https://metapool.app/dapp/mainnet/metapool-aurora/'} target="_blank">
                  Get STNEAR ↗
                </StyledLink>
              </Box>
            )}
            {acBank.depositTokenName.startsWith('BINARIS-BNB') && (
              <Box style={{ marginTop: '10px' }}>
                <StyledLink href={'https://app.allbridge.io/bridge?from=BSC&to=AURO&asset=BNB'} target="_blank">
                  Bridge BNB ↗
                </StyledLink>
              </Box>
            )}
            {acBank.depositTokenName.startsWith('WETH') && (
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
              {/* <Button onClick={onRedeem} color="primary" variant="contained">
                Claim & Withdraw
              </Button> */}
            </div>
          </StyledBank>
        </Grid>
      </Grid>
    </>
  ) : !acBank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ acBank: BankEntity }> = ({ acBank }) => {
  const polarisFinance = usePolarisFinance();
  const tombAddr = polarisFinance.POLAR.address;
  const tshareAddr = polarisFinance.SPOLAR.address;
  const lunarAddr = polarisFinance.LUNAR.address;
  const tripolarAddr = polarisFinance.TRIPOLAR.address;
  const ethernalAddr = polarisFinance.ETHERNAL.address;
  const orbitalAddr = polarisFinance.ORBITAL.address;
  const uspAddr = polarisFinance.USP.address;
  let pairName: string;
  let uniswapUrl: string;
  if (acBank.depositTokenName === 'POLAR-NEAR-LP') {
    pairName = 'POLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tombAddr;
  } else if (acBank.depositTokenName === 'SPOLAR-NEAR-LP') {
    pairName = 'SPOLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tshareAddr;
  } else if (acBank.depositTokenName === 'POLAR-STNEAR-LP') {
    pairName = 'POLAR-STNEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30/' + tombAddr;
  } else if (acBank.depositTokenName === 'LUNAR-LUNA-LP') {
    pairName = 'LUNAR-LUNA pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096/' + lunarAddr;
  } else if (acBank.depositTokenName === 'POLAR-LUNAR-LP') {
    pairName = 'POLAR-LUNAR-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/' + tombAddr + '/' + lunarAddr;
  } else if (acBank.depositTokenName === 'ETHERNAL-ETH-LP') {
    pairName = 'ETHERNAL-ETH-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/ETH/' + ethernalAddr;
  } else if (acBank.depositTokenName === 'ORBITAL-BTC-LP') {
    pairName = 'ORBITAL-BTC-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e/' + orbitalAddr;
  } else if (acBank.depositTokenName === 'TRIPOLAR-TRI-LP') {
    pairName = 'TRIPOLAR-TRI-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xFa94348467f64D5A457F75F8bc40495D33c65aBB/' + tripolarAddr;
  } else if (acBank.depositTokenName === 'USP-USDC-LP') {
    pairName = 'USP-USDC-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/' + uspAddr;
  } else if (acBank.depositTokenName === 'POLAR-USP-LP') {
    pairName = 'POLAR-USP-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/' + uspAddr + '/' + tombAddr;
  } else if (acBank.depositTokenName === 'ETHERNAL-USP-LP') {
    pairName = 'ETHERNAL-USP-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/' + uspAddr + '/' + ethernalAddr;
  } else if (acBank.depositTokenName === 'ORBITAL-USP-LP') {
    pairName = 'ORBITAL-USP-LP';
    uniswapUrl = 'https://www.trisolaris.io/#/add/' + uspAddr + '/' + orbitalAddr;
  } else if (acBank.depositTokenName === 'BINARIS-BNB-LP') {
    pairName = 'BINARIS-BNB-LP';
    uniswapUrl =
      'https://www.trisolaris.io/#/add/0xb14674C7264eC7d948B904Aab2c0E0F906F6e762/0xafE0d6ca6AAbB43CDA024895D203120831Ba0370';
  } else if (acBank.depositTokenName === 'BINARIS-USP-LP') {
    pairName = 'BINARIS-USP-LP';
    uniswapUrl =
      'https://www.trisolaris.io/#/add/0xafE0d6ca6AAbB43CDA024895D203120831Ba0370/0xa69d9Ba086D41425f35988613c156Db9a88a1A96';
  } else {
    pairName = 'TRIPOLAR-xTRI pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0x802119e4e253D5C19aA06A5d567C5a41596D6803/' + tripolarAddr;
  }

  return (
    <>
      {/*acBank.depositTokenName.startsWith('ORBITAL') && (
        <Typography style={{ color: 'white' }}> Note: The LPs are multiplied by 10000. </Typography>
      )*/}
      <StyledLink style={{ marginTop: '20px' }} href={uniswapUrl} target="_blank">
        {`Provide liquidity for ${pairName} now on Trisolaris`}
      </StyledLink>
    </>
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
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a acBank just robbed by unicorns." />
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

export default AcBank;
