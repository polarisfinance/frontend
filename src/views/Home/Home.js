import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import {
  polar as tombTesting,
  tShare as tShareTesting,
  lunar as lunarTesting,
  tripolar as tripolarTesting,
} from '../../polaris-finance/deployments/deployments.testing.json';
import {
  polar as tombProd,
  tShare as tShareProd,
  lunar as lunarProd,
  tripolar as tripolarProd,
} from '../../polaris-finance/deployments/deployments.mainnet.json';
import ValueLocked from '../../assets/img/value_locked.svg';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import usePolarisFinance from '../../hooks/usePolarisFinance';

import useLunarStats from '../../hooks/useLunarStats';
import useLunarBondStats from '../../hooks/useLunarBondStats';

import useTripolarStats from '../../hooks/useTripolarStats';
import useTripolarBondStats from '../../hooks/useTripolarBondStats';

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

function numberWithSpaces(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const polarisFinance = usePolarisFinance();

  const lunarStats = useLunarStats();
  const lBondStats = useLunarBondStats();

  const tripolarStats = useTripolarStats();
  const triBondStats = useTripolarBondStats();
  let polar;
  let tShare;
  let lunar;
  let tripolar;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    polar = tombTesting;
    tShare = tShareTesting;
    lunar = lunarTesting;
    tripolar = tripolarTesting;
  } else {
    polar = tombProd;
    tShare = tShareProd;
    lunar = lunarProd;
    tripolar = tripolarProd;
  }
  const buyTombAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + polar.address;
  const buyTShareAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + tShare.address;
  const buyLunarAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + lunar.address;
  const buyTripolarAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + tripolar.address;

  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const lunarPriceInLUNA = useMemo(() => (lunarStats ? Number(lunarStats.tokenInFtm).toFixed(4) : null), [lunarStats]);
  const lunarPriceInDollars = useMemo(
    () => (lunarStats ? Number(lunarStats.priceInDollars).toFixed(2) : null),
    [lunarStats],
  );
  const lunarCirculatingSupply = useMemo(
    () => (lunarStats ? String(lunarStats.circulatingSupply) : null),
    [lunarStats],
  );
  const lunarTotalSupply = useMemo(() => (lunarStats ? String(lunarStats.totalSupply) : null), [lunarStats]);

  const tripolarPriceInXTRI = useMemo(
    () => (tripolarStats ? Number(tripolarStats.tokenInFtm).toFixed(4) : null),
    [tripolarStats],
  );
  const tripolarPriceInDollars = useMemo(
    () => (tripolarStats ? Number(tripolarStats.priceInDollars).toFixed(2) : null),
    [tripolarStats],
  );
  const tripolarCirculatingSupply = useMemo(
    () => (tripolarStats ? String(tripolarStats.circulatingSupply) : null),
    [tripolarStats],
  );
  const tripolarTotalSupply = useMemo(
    () => (tripolarStats ? String(tripolarStats.totalSupply) : null),
    [tripolarStats],
  );

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const lBondPriceInDollars = useMemo(
    () => (lBondStats ? Number(lBondStats.priceInDollars).toFixed(2) : null),
    [lBondStats],
  );
  const lBondPriceInFTM = useMemo(() => (lBondStats ? Number(lBondStats.tokenInFtm).toFixed(4) : null), [lBondStats]);
  const lBondCirculatingSupply = useMemo(
    () => (lBondStats ? String(lBondStats.circulatingSupply) : null),
    [lBondStats],
  );
  const lBondTotalSupply = useMemo(() => (lBondStats ? String(lBondStats.totalSupply) : null), [lBondStats]);

  const triBondPriceInDollars = useMemo(
    () => (triBondStats ? Number(triBondStats.priceInDollars).toFixed(2) : null),
    [triBondStats],
  );
  const triBondPriceInFTM = useMemo(
    () => (triBondStats ? Number(triBondStats.tokenInFtm).toFixed(4) : null),
    [triBondStats],
  );
  const triBondCirculatingSupply = useMemo(
    () => (triBondStats ? String(triBondStats.circulatingSupply) : null),
    [triBondStats],
  );
  const triBondTotalSupply = useMemo(() => (triBondStats ? String(triBondStats.totalSupply) : null), [triBondStats]);

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
                <StyledNormalLink href="/sunrise">SUNRISE</StyledNormalLink> to earn more POLAR, LUNAR and TRIPOLAR.
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

        {/* Tshare */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="SPOLAR" />
                    </CardIcon>
                  </Box>
                  <h2 width={80}>SPOLAR</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tSharePriceInFTM ? tSharePriceInFTM : '-.----'} NEAR</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number((tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('SPOLAR');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href={buyTShareAddress}
                      style={{ marginTop: '12px', minWidth: '70px', maxWidth: '70px' }}
                    >
                      BUY
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href="https://dexscreener.com/aurora/0xadf9d0c77c70fcb1fdb868f54211288fce9937df"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      CHART
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {tShareCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {tShareTotalSupply}</span>
          </Grid>
        </Grid>
        {/* POLAR */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent
              className={classes.root}
              align="center"
              style={{ position: 'relative', paddingBottom: '16px' }}
            >
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="POLAR" />
                    </CardIcon>
                  </Box>
                  <h2>POLAR</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.----'} NEAR</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(tombCirculatingSupply * tombPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('POLAR');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href={buyTombAddress}
                      style={{ marginTop: '12px', minWidth: '70px', maxWidth: '70px' }}
                    >
                      BUY
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href="https://dexscreener.com/aurora/0x3fa4d0145a0b6ad0584b1ad5f61cb490a04d8242"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      CHART
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {tombCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {tombTotalSupply}</span>
          </Grid>
        </Grid>
        {/* LUNAR */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent
              className={classes.root}
              align="center"
              style={{ position: 'relative', paddingBottom: '16px' }}
            >
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="LUNAR" />
                    </CardIcon>
                  </Box>
                  <h2>LUNAR</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{lunarPriceInLUNA ? lunarPriceInLUNA : '-.----'} LUNA</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${lunarPriceInDollars ? lunarPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(lunarCirculatingSupply * lunarPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('LUNAR');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href={buyLunarAddress}
                      style={{ marginTop: '12px', minWidth: '70px', maxWidth: '70px' }}
                    >
                      BUY
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href="https://dexscreener.com/aurora/0x3e50da46cB79d1f9F08445984f207278796CE2d2"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      CHART
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {lunarCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {lunarTotalSupply}</span>
          </Grid>
        </Grid>
        {/* TRIPOLAR */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent
              className={classes.root}
              align="center"
              style={{ position: 'relative', paddingBottom: '16px' }}
            >
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="TRIPOLAR" />
                    </CardIcon>
                  </Box>
                  <h2>TRIPOLAR</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      {tripolarPriceInXTRI ? tripolarPriceInXTRI : '-.----'} xTRI
                    </span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>
                      ${tripolarPriceInDollars ? tripolarPriceInDollars : '-.--'}
                    </span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(tripolarCirculatingSupply * tripolarPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('TRIPOLAR');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href={buyTripolarAddress}
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      BUY
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      target="_blank"
                      href="https://dexscreener.com/aurora/0x85f155FDCf2a951fd95734eCEB99F875b84a2E27"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      CHART
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>
              Circulating Supply: {tripolarCirculatingSupply}
            </span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {tripolarTotalSupply}</span>
          </Grid>
        </Grid>
        {/* Tbond */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="PBOND" />
                    </CardIcon>
                  </Box>
                  <h2>PBOND</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.----'} NEAR</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('PBOND');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      href="/polar_bond"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      BOND
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {tBondCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {tBondTotalSupply}</span>
          </Grid>
        </Grid>
        {/* LBOND */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="LBOND" />
                    </CardIcon>
                  </Box>
                  <h2>LBOND</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{lBondPriceInFTM ? lBondPriceInFTM : '-.----'} LUNA</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${lBondPriceInDollars ? lBondPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(lBondCirculatingSupply * lBondPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('LBOND');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      href="/lunar_bond"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      BOND
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {lBondCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {lBondTotalSupply}</span>
          </Grid>
        </Grid>
        {/* TRIBOND */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
              <Grid container alignItems="center">
                <Grid container item xs={12} sm={4} className={classes.icon}>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="TRIBOND" />
                    </CardIcon>
                  </Box>
                  <h2>TRIBOND</h2>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{triBondPriceInFTM ? triBondPriceInFTM : '-.----'} xTRI</span>
                  </Box>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${triBondPriceInDollars ? triBondPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces(Number(triBondCirculatingSupply * triBondPriceInDollars).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={2} justify="center">
                  <Grid item xs={4} sm={12}>
                    <Button
                      onClick={() => {
                        polarisFinance.watchAssetInMetamask('TRIBOND');
                      }}
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px' }}
                    >
                      &nbsp;
                      <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      &nbsp;
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      href="/tripolar_bond"
                      className={classes.button}
                      style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                    >
                      BOND
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          {/*
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
          </Grid>
          */}
          <Grid item>
            <span style={{ fontSize: '20px', marginRight: '20px' }}>
              Circulating Supply: {triBondCirculatingSupply}
            </span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {triBondTotalSupply}</span>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
