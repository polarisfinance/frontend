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
import useLpStats from '../../hooks/useLpStats';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { polar as tombTesting, tShare as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { polar as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import ValueLocked from '../../assets/img/value_locked.svg'

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
  box: {
    backgroundImage: `url(${ValueLocked})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#6fd44b',
    height: '100%',
    margin: '-24px 12px -12px 12px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: '#FFFFFF',
    borderRadius: '10px',
  },
  card: {
    maxWidth: "40%",
    minHeight: "20vh",
    display: "flex",
    alignItems: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('POLAR-NEAR-LP');
  const tShareFtmLpStats = useLpStats('SPOLAR-NEAR-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();

  let polar;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    polar = tombTesting;
    tShare = tShareTesting;
  } else {
    polar = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + polar.address;
  const buyTShareAddress = 'https://www.trisolaris.io/#/swap?outputCurrency=' + tShare.address;

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

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


  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
  `;



  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        
        <Grid container>
          {/* Explanation text */}
          <Grid item xs={12} sm={6}>
            
            <Box color="primary" p={4}>
              <h2 style={{fontSize: '28px'}}>Welcome to Polaris Finance</h2>
              <p style={{fontSize: '20px'}}>The first algorithmic stablecoin on Aurora chain, pegged to the price of 1 NEAR via
                seigniorage. Stake your POLAR-NEAR LP in the Dawn to earn SPOLAR rewards. Then
                stake your earned SPOLAR in the Sunrise to earn more POLAR!</p>

            </Box>
            
          </Grid>
          <Grid item xs={12} sm={6} align="center">
            <Box className={classes.box} style={{ paddingTop:'12px'}}>
              <span style={{ fontSize: '25px', fontFamily: '"Rajdhani",regular'}}>Total Value Locked</span>
              <CountUp style={{ fontSize: '60px', fontFamily: '"Rajdhani",bold' }} end={TVL} separator="," prefix="$ " />
            </Box>

            
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px' }}>
            <Alert style={{backgroundColor: '#b43387',fontSize: '20px'}} variant="filled" severity="warning">
              <b>
                Please visit our{' '}
                <StyledLink target="_blank" href="https://docs.polarisfinance.io">
                  documentation
                </StyledLink>{' '}
                before purchasing POLAR or SPOLAR!
              </b>
            </Alert>
          </Grid>
        </Grid>


        {/* Wallet */}
        <Grid container item xs={12} sm={12} >
          <Button color="primary" href="/dawn" variant="contained" style={{ marginRight: '12px', marginBottom: '12px' }}>
            FARM IN DAWN
          </Button>
          <Button color="primary" href="/sunrise" variant="contained" style={{ marginRight: '12px', marginBottom: '12px' }}>
            STAKE IN SUNRISE
          </Button>
          <Button
            color="secondary"
            target="_blank"
            href={buyTombAddress}
            variant="contained"
            style={{ marginRight: '12px', marginBottom: '12px'  }}
            className={classes.button}
          >
            BUY POLAR
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button} style={{ marginRight: '12px', marginBottom: '12px' }}>
            BUY SPOLAR
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button} style={{ marginRight: '12px', marginBottom: '12px' }}>
            POLAR CHARTS
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button} style={{ marginRight: '12px', marginBottom: '12px' }}>
            SPOLAR CHARTS
          </Button>
          
        </Grid>

        {/* TOMB */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent className={classes.root} align="center" style={{ position: 'relative',paddingBottom: '16px' }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('POLAR');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Grid container alignItems='center'>
                <Grid container item sm={4} alignItems='center'>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="POLAR" />
                    </CardIcon>
                  </Box>          
                  <h2>POLAR</h2>
                </Grid>
                <Grid item sm={4}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.----'} NEAR</span>
                  </Box>
                </Grid>
                <Grid item sm={4}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)}</span>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px" }}>Circulating Supply: {tombCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',paddingRight:'12px'}}>Total Supply: {tombTotalSupply}</span>
          </Grid>
        </Grid>
        
        {/* Tshare */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative',paddingBottom: '16px'  }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('SPOLAR');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Grid container alignItems='center'>
                <Grid container item sm={4} alignItems='center'>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="SPOLAR" />
                    </CardIcon>
                  </Box>          
                  <h2>SPOLAR</h2>
                </Grid>
                <Grid item sm={4}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tSharePriceInFTM ? tSharePriceInFTM : '-.----'} NEAR</span>
                  </Box>
                </Grid>
                <Grid item sm={4}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)}</span>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px" }}>Circulating Supply: {tShareCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',paddingRight:'12px'}}>Total Supply: {tShareTotalSupply}</span>
          </Grid>
        </Grid>
              
        {/* Tbond */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative',paddingBottom: '16px'  }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('PBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Grid container alignItems='center'>
                <Grid container item sm={4} alignItems='center'>
                  <Box mr={5} ml={5} mt={2}>
                    <CardIcon>
                      <TokenSymbol symbol="PBOND" />
                    </CardIcon>
                  </Box>          
                  <h2>PBOND</h2>
                </Grid>
                <Grid item sm={4}>
                  Current Price
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.----'} NEAR</span>
                  </Box>
                </Grid>
                <Grid item sm={4}>
                  Market Cap:
                  <Box>
                    <span style={{ fontSize: '30px' }}>${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)}</span>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px"}}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',marginRight:"20px" }}>Circulating Supply: {tBondCirculatingSupply}</span>
          </Grid>
          <Grid item>
            <span style={{ fontSize: '20px',paddingRight:'12px'}}>Total Supply: {tBondTotalSupply}</span>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;