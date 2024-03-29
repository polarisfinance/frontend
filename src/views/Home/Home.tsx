import React from 'react';
import Page from '../../components/Page';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import CountUp from 'react-countup';

import useTotalValueLocked from '../../hooks/useTotalValueLocked';

import ValueLocked from '../../assets/img/value_locked.svg';

import { Box, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import TokenCard from './TokenCard';
import useSunrises from '../../hooks/useSunrises';

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
    [theme.breakpoints.down(850)]: {
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
      <Grid container spacing={3}>
        <Grid container>
          {/* Explanation text */}
          <Grid item xs={12} sm={6}>
            <Box color="primary" p={4}>
              <h2 style={{ fontSize: '28px', color: '#fff' }}>Welcome to Polaris Finance</h2>
              <p style={{ fontSize: '20px', color: '#fff' }}>
                Please move all your assets into our new{' '}
                <StyledNormalLink href="https://app.polarisfinance.io">Polaris DEX</StyledNormalLink>
              </p>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
            <Box className={classes.box} style={{ paddingTop: '12px' }}>
              <span style={{ fontSize: '25px', fontFamily: '"Rajdhani",regular' }}>Total Value Locked</span>
              <div style={{ fontSize: '60px', fontFamily: '"Rajdhani",bold' }}>
                <CountUp end={TVL} separator=" " prefix="$" />
              </div>
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
