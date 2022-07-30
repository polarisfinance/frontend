import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Typography, Grid } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import UnlockWallet from '../../components/UnlockWallet';

import useSunrise from '../../hooks/useSunrise';

import useRedeemOnSunrise from '../../hooks/useRedeemOnSunrise';
import useStakedBalanceOnSunrise from '../../hooks/useStakedBalanceOnSunrise';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchSunriseAPR from '../../hooks/useFetchSunriseAPR';
import useTokenEstimatedTWAP from '../../hooks/useTokenEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnSunrise from '../../hooks/useTotalStakedOnSunrise';
import useClaimRewardCheck from '../../hooks/masonry/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/masonry/useWithdrawCheck';
import useTokenPreviousEpochTWAP from '../../hooks/useTokenPreviousEpochTWAP';

import Image from 'material-ui-image';
import Fire from '../../assets/img/fire.gif';

import moment from 'moment';
import { getDisplayBalance } from '../../utils/formatBalance';

import Harvest from './components/Harvest';
import Stake from './components/Stake';
import ProgressCountdown from './components/ProgressCountdown';
import { Alert } from '@material-ui/lab';
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  text: {
    fontSize: '20px',
    color: '#fff',
  },
}));

const Sunrise: React.FC = () => {
  const classes = useStyles();
  const { sunriseId } = useParams<{ sunriseId: string }>();
  const sunrise = useSunrise(sunriseId);
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnSunrise(sunrise);
  const stakedBalance = useStakedBalanceOnSunrise(sunrise);
  const currentEpoch = useCurrentEpoch(sunrise);
  const cashStat = useTokenEstimatedTWAP(sunrise);
  const totalStaked = useTotalStakedOnSunrise(sunrise);
  const masonryAPR = useFetchSunriseAPR(sunrise);
  const canClaimReward = useClaimRewardCheck(sunrise);
  const canWithdraw = useWithdrawCheck(sunrise);
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes(sunrise);
  const polarPreviousEpochTwap = useTokenPreviousEpochTWAP(sunrise);
  let earnTokenName: string;
  if (sunrise.earnTokenName.startsWith('OLD')) {
    earnTokenName = sunrise.earnTokenName.slice(3);
  } else {
    earnTokenName = sunrise.earnTokenName;
  }
  return account && sunrise ? (
    <>
      {' '}
      {sunrise.boosted ? (
        <Grid container item justify="center">
          <Image
            color="none"
            imageStyle={{ height: '45px', width: '45px' }}
            style={{ height: '50px', width: '50px', paddingTop: '0px', marginRight: '10px', marginBottom: '10px' }}
            src={Fire}
            animationDuration={0}
            disableTransition={true}
            disableSpinner={true}
          />
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            {earnTokenName} Sunrise
          </Typography>
          <Image
            color="none"
            imageStyle={{ height: '45px', width: '45px' }}
            style={{ height: '50px', width: '50px', paddingTop: '0px', marginBottom: '10px', marginLeft: '7px' }}
            src={Fire}
            animationDuration={0}
            disableTransition={true}
            disableSpinner={true}
          />
        </Grid>
      ) : (
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
          {earnTokenName} Sunrise
        </Typography>
      )}
      {!sunrise.retired && (
        <Grid container item justify="center">
          <Alert
            variant="filled"
            severity="warning"
            style={{ backgroundColor: '#b43387', fontSize: '18px', paddingTop: 0, paddingBottom: 0 }}
          >
            {' '}
            {sunrise.name === 'ethernal' || sunrise.name === 'orbital' ? (
              <b>
                As we are in recovery mode, it is important to not sell your rewards. Please stake your {earnTokenName}{' '}
                in the DAWN single stake.
              </b>
            ) : (
              <b>Sunrise prints only when the TWAP is above 1.01</b>
            )}{' '}
          </Alert>
        </Grid>
      )}
      <Grid container className={classes.text}>
        {sunrise.retired ? (
          <Grid container item xs={12} justify="center" className={classes.text}>
            <Box mt={3} style={{ width: '100%', marginBottom: '12px', marginTop: '0' }}>
              <Alert style={{ backgroundColor: '#b43387', fontSize: '20px' }} variant="filled" severity="warning">
                <b>{sunrise.retireMsg}</b>
              </Alert>
            </Box>
          </Grid>
        ) : (
          <Grid container item xs={12} justify="center" className={classes.text}>
            <Box mt={3} style={{ width: '100%', marginBottom: '12px', marginTop: '0' }}>
              <Typography style={{ backgroundColor: 'none', fontSize: '30px', textAlign: 'center' }}>
                Staked SPOLARs can only be withdrawn after 3 epochs since deposit.
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Stake sunrise={sunrise} contract={sunrise.contract} retired={sunrise.retired} />
        </Grid>
        <Grid container item xs={12} md={4} alignItems="center" direction="row">
          <Grid container item xs={12}>
            <Grid item xs={7} container justify="flex-end">
              <Typography className={classes.text} style={{ textAlign: 'center' }}>
                Next Epoch:
              </Typography>
            </Grid>
            <Grid item xs={5} container justify="center">
              <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
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
                {earnTokenName} Price<small>(TWAP)</small>:
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
          <Harvest sunrise={sunrise} />
        </Grid>
      </Grid>
      <Box mt={5}>
        <Grid container justify="center" spacing={3}>
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
  ) : !sunrise ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Sunrise;
