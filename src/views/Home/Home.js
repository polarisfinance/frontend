import React from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';

import useTotalValueLocked from '../../hooks/useTotalValueLocked';

import ValueLocked from '../../assets/img/value_locked.svg';

import { Box, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import TokenCard from './TokenCard';
import useSunrises from '../../hooks/useSunrises';

import { Container } from '@material-ui/core';
import Image from 'material-ui-image';
import AuroraLogo from '../../assets/img/aurora_logo_white.svg';
import NearLogo from '../../assets/img/near_logo_white.svg';
import Plus from '../../assets/img/plus.svg';
import Equal from '../../assets/img/=.svg';
import NameLogo from '../../assets/img/name-logo.svg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundImage: `url(${ValueLocked})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#6fd44b',
    height: '60%',
    margin: '48px 12px -12px 12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: '10px',
  },
  card: {
    maxWidth: '40%',
    minHeight: '20vh',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    [theme.breakpoints.down('850')]: {
      justifyContent: 'center',
    },
    alignItems: 'center',
  },
  button: {
    [theme.breakpoints.down('xs')]: {
      marginTop: '12px',
    },
  },
}));

const Home = () => {
  const [sunrises] = useSunrises();
  const activeSunrises = sunrises.filter((sunrise) => !sunrise.coming).filter((sunrise) => !sunrise.retired);
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: underline;
    color: white;
  `;
  const StyledNormalLink = styled.a`
    text-decoration: underline;
    color: white;
  `;

  return (
    <Page>
      <BackgroundImage />
      {/* <LaunchCountdown deadline={new Date(1645106400*1000)} description='hello'></LaunchCountdown> */}
      <Container maxWidth="lg" style={{ marginTop: '10px', marginBottom: '3rem', padding: '0px' }}>
        <Grid container>
          {/* Logo */}
          <Grid container item xs={12} sm={4}>
            {/* <Paper>xs=6 sm=3</Paper> */}
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '100px' }}
                style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
                src={AuroraLogo}
                animationDuration={0}
                disableTransition={true}
                disableSpinner={true}
              />
            </Grid>
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '40px', marginTop: '20px' }}
                style={{ height: '30px', paddingTop: '0px', marginTop: '30px' }}
                src={Plus}
                animationDuration={0}
                disableTransition={true}
                disableSpinner={true}
              />
            </Grid>
            <Grid item xs={4}>
              <Image
                color="none"
                imageStyle={{ height: '100px' }}
                style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
                src={NearLogo}
                animationDuration={0}
                disableTransition={true}
                disableSpinner={true}
              />
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Grid item xs={2} sm={2}>
              {/* <Paper>xs=6 sm=3</Paper> */}
              <Image
                color="none"
                imageStyle={{ height: '20px', marginTop: '20px' }}
                style={{ height: '20px', paddingTop: '0px', marginTop: '40px' }}
                src={Equal}
                animationDuration={0}
                disableTransition={true}
                disableSpinner={true}
              />
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            {/* <Paper>xs=6 sm=3</Paper> */}
            <Image
              color="none"
              imageStyle={{ height: '100px' }}
              style={{ height: '100px', paddingTop: '0px', marginTop: '20px' }}
              src={NameLogo}
              animationDuration={0}
              disableTransition={true}
              disableSpinner={true}
            />
          </Grid>
        </Grid>
      </Container>
      <Grid container spacing={3}>
        <Grid container>
          {/* Explanation text */}
          <Grid item xs={12} sm={6}>
            <Box color="primary" p={4}>
              <h2 style={{ fontSize: '28px' }}>Welcome to Polaris Finance</h2>
              <p style={{ fontSize: '20px' }}>
                The very first algorithmic stablecoins ecosystem on Aurora / NEAR. We are bringing multiple pegged
                assets 1:1 to native coins via seigniorage. Provide liquidity in{' '}
                <StyledNormalLink href="/dawn">DAWN</StyledNormalLink> Farms to get SPOLAR - governance token that
                controls inflation and expansion of all pegged assets. Stake your SPOLAR in{' '}
                <StyledNormalLink href="/sunrise">SUNRISE</StyledNormalLink> to earn more POLAR, ETHERNAL and TRIPOLAR.
              </p>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} align="center">
            <Box className={classes.box} style={{ paddingTop: '12px' }}>
              <span style={{ fontSize: '25px', fontFamily: '"Rajdhani",regular' }}>Total Value Locked</span>
              <CountUp style={{ fontSize: '60px', fontFamily: '"Rajdhani",bold' }} end={TVL} separator=" " prefix="$" />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} style={{ margin: '12px' }}>
            <Alert style={{ backgroundColor: '#b43387', fontSize: '20px' }} variant="filled" severity="warning">
              <b>
                Please visit our{' '}
                <StyledLink target="_blank" href="https://docs.polarisfinance.io">
                  documentation
                </StyledLink>{' '}
                before purchasing any of our tokens!
              </b>
            </Alert>
          </Grid>
        </Grid>
        <TokenCard
          token={'SPOLAR'}
          tokenAddress={'0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729'}
          lpAddress={'0xADf9D0C77c70FCb1fDB868F54211288fCE9937DF'}
          lpToken={'NEAR'}
        />
        {activeSunrises.map((sunrise) => (
          <React.Fragment key={sunrise.earnTokenName}>
            <TokenCard
              token={sunrise.earnTokenName}
              tokenAddress={sunrise.tokenAddress}
              lpAddress={sunrise.lpAddress}
              lpToken={sunrise.lpToken}
            />
          </React.Fragment>
        ))}
        {activeSunrises.map((sunrise) => (
          <React.Fragment key={sunrise.bond}>
            <TokenCard token={sunrise.bond} bond={sunrise.name} lpToken={sunrise.lpToken} />
          </React.Fragment>
        ))}
      </Grid>
    </Page>
  );
};

export default Home;
