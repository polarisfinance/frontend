import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';

import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnLunarSunrise from '../../hooks/useRedeemOnLunarSunrise';
import useStakedBalanceOnLunarSunrise from '../../hooks/useStakedBalanceOnLunarSunrise';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpochLunar';
import useFetchMasonryAPR from '../../hooks/useFetchLunarSunriseAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAPLunar';
import useTreasuryAllocationTimes from '../../hooks/useLunarTreasuryAllocationTimes';
import useTotalStakedOnMasonry from '../../hooks/useTotalStakedOnLunarSunrise';
import useClaimRewardCheck from '../../hooks/masonry/useClaimRewardCheckLunarSunrise';
import useWithdrawCheck from '../../hooks/masonry/useWithdrawCheckLunarSunrise';
import ProgressCountdown from './components/ProgressCountdown';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';
import usePolarPreviousEpochTwap from '../../hooks/useLunarPreviousEpochTwap';
const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
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
  },
}));

const Masonry = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnLunarSunrise();
  const stakedBalance = useStakedBalanceOnLunarSunrise();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnMasonry();
  const masonryAPR = useFetchMasonryAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const polarPreviousEpochTwap = usePolarPreviousEpochTwap();
  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Sunrise
          </Typography>
          <Grid container className={classes.text}>
            <Grid container item xs={12} justify="center" className={classes.text}>
              <Box mt={3} style={{ width: '100%', marginBottom: '12px', marginTop: '0' }}>
                <Typography style={{ backgroundColor: 'none', fontSize: '30px', textAlign: 'center' }}>
                  Staked SPOLARs can only be withdrawn after 3 epochs since deposit.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} justify="center">
              <Stake />
            </Grid>
            <Grid container item xs={12} md={4} alignItems="center" direction="row">
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text} style={{ textAlign: 'center' }}>
                    Next Epoch:
                  </Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <ProgressCountdown
                    className={classes.text}
                    base={moment().toDate()}
                    hideBar={true}
                    deadline={to}
                    description="Next Epoch"
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text}>Current Epoch:</Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <Typography className={classes.text}>{Number(currentEpoch)}</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text}>
                    LUNAR Price<small>(TWAP)</small>:
                  </Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <Typography className={classes.text}>{scalingFactor}</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text}>
                    Previous Epoch<small>(TWAP)</small>:
                  </Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <Typography className={classes.text}>{getDisplayBalance(polarPreviousEpochTwap)}</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text}>APR:</Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <Typography className={classes.text}>{masonryAPR.toFixed(2)}%</Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={7} container justify="flex-end">
                  <Typography className={classes.text}>SPOLARS Staked:</Typography>
                </Grid>
                <Grid item xs={5} container justify="center">
                  <Typography className={classes.text}>{getDisplayBalance(totalStaked)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Harvest />
            </Grid>
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

export default Masonry;
