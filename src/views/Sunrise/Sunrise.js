import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnMasonry from '../../hooks/useRedeemOnMasonry';
import useStakedBalanceOnMasonry from '../../hooks/useStakedBalanceOnMasonry';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchMasonryAPR from '../../hooks/useFetchMasonryAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnMasonry from '../../hooks/useTotalStakedOnMasonry';
import useClaimRewardCheck from '../../hooks/masonry/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/masonry/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import MasonryImage from '../../assets/img/masonry.png';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png'
const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  text: {
    fontSize: '20px',
  }
}));

const Masonry = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnMasonry();
  const stakedBalance = useStakedBalanceOnMasonry();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnMasonry();
  const masonryAPR = useFetchMasonryAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Sunrise
          </Typography>
          <Grid container  className={classes.text}>
            <Grid container item xs={12} justify="center"  className={classes.text}>
              <Box mt={3} style={{ width: '100%', marginBottom: '12px', marginTop: '0' }}>
                <Typography style={{backgroundColor: 'none', fontSize: '30px', textAlign: 'center'}}>
                  Staked SPOLARs can only be withdrawn after 6 epochs since deposit.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} justify="center">
              <Stake />
            </Grid>
            <Grid container item xs={12} md={4} alignItems="center" direction="row">
              <Grid container item xs={12}>
                <Grid item xs={6} container justify="flex-end">
                  <Typography  className={classes.text} style={{ textAlign: 'center' }}>Next Epoch:</Typography>
                </Grid>
                <Grid item xs={6} container justify='center'>
                  <ProgressCountdown  className={classes.text} base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6} container justify="flex-end">
                  <Typography  className={classes.text}>Current Epoch:</Typography>
                </Grid>
                <Grid item xs={6} container justify='center'>
                  <Typography  className={classes.text}>{Number(currentEpoch)}</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6} container justify="flex-end">
                  <Typography className={classes.text}>
                    POLAR Price<small>(TWAP)</small>:
                  </Typography>
                </Grid>
                <Grid item xs={6} container justify='center'>
                  <Typography className={classes.text}>{scalingFactor}</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6} container justify="flex-end">
                  <Typography className={classes.text}>APR:</Typography>
                </Grid>
                <Grid item xs={6} container justify='center'>
                  <Typography className={classes.text}>{masonryAPR.toFixed(2)}%</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6} container justify="flex-end">
                  <Typography className={classes.text}>SPOLARS Staked:</Typography>
                </Grid>
                <Grid item xs={6} container justify='center'>
                  <Typography className={classes.text}>{getDisplayBalance(totalStaked)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Harvest />              
            </Grid>

            {/* <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
          </Grid>

          <Box mt={5}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
                color="primary"
                variant="contained"
              >
                Claim and Withdraw
              </Button>
            </Grid>
          </Box>
        </>
      ) : (
        <UnlockWallet />
      )}
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
  width: 600px;
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

export default Masonry;
