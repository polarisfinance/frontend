import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import Image from 'material-ui-image';
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

import AuroraLogo from '../../assets/img/aurora_logo_white.svg'
import NearLogo from '../../assets/img/near_logo_white.svg'
import Plus from '../../assets/img/+.svg'
import Equal from '../../assets/img/=.svg'
import NameLogo from '../../assets/img/name-logo.svg'
import ValueLocked from '../../assets/img/value_locked.svg'

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';

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
    color: "green",
    backgroundImage: `url(${ValueLocked})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    height: '100%',
    margin: 'auto',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: '#FFFFFF',
    paddingRight: '12px'
  },
  card: {
    maxWidth: "40%",
    minHeight: "20vh",
    display: "flex",
    alignItems: "center"
  }
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
        
        <Grid container >
          
          {/* Logo */}
          <Grid container item xs={4} sm={4}>
            {/* <Paper>xs=6 sm=3</Paper> */}   
            <Grid item xs={4}>
              <Image color="none" imageStyle={{ height:'100px'}} style={{height:'100px',paddingTop: '50px'}} src={AuroraLogo} />
            </Grid>
            <Grid item xs={4}>
              <Image color="none" imageStyle={{ height:'100px' }} style={{height:'100px',paddingTop: '50px'}} src={Plus} />
            </Grid>
            <Grid item xs={4}>
              <Image color="none" imageStyle={{ height:'100px' }} style={{height:'100px',paddingTop: '50px'}} src={NearLogo} />
            </Grid>
          </Grid>
        
          <Grid item xs={2} sm={2} justifyContent="center" alignItems="center" direction="column">
            {/* <Paper>xs=6 sm=3</Paper> */}   
            <Image color="none"  imageStyle={{ height:'100px' }} style={{height:'100px',paddingTop: '50px'}} src={Equal} />
          </Grid>
          <Grid item xs={6} sm={6}>
            {/* <Paper>xs=6 sm=3</Paper> */}   
            <Image color="none"  imageStyle={{ height:'100px'}} style={{height:'100px',paddingTop: '50px'}} src={NameLogo}  />
          </Grid>
        </Grid> 
        <Grid container>
          {/* Explanation text */}
          <Grid item xs={12} sm={6}>
            
            <Box color="primary" p={4}>
              <h2>Welcome to Polaris Finance</h2>
              <p>The first algorithmic stablecoin on Aurora chain, pegged to the price of 1 NEAR via seigniorage.</p>
              <p>
                Stake your POLAR-NEAR LP in the Dawn to earn SPOLAR rewards. Then stake your earned SPOLAR in the
                Sunrise to earn more POLAR!
              </p>
            </Box>
            
          </Grid>
          <Grid item xs={12} sm={6} align="center">
            <Box className={classes.box}>
              <span style={{ fontSize: '50px', fontFamily: '"Rajdhani",regular'}}>Total Value Locked</span>
              <CountUp style={{ fontSize: '60px' }} end={TVL} separator="," prefix="$" />
            </Box>

            
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px' }}>
            <Alert variant="filled" severity="warning">
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
          
          <Button color="primary" href="/dawn" variant="contained" style={{ marginRight: '10px' }}>
            FARM IN DAWN
          </Button>
          <Button color="primary" href="/sunrise" variant="contained" style={{ marginRight: '10px' }}>
            STAKE IN SUNRISE
          </Button>
          <Button
            color="secondary"
            target="_blank"
            href={buyTombAddress}
            variant="contained"
            style={{ marginRight: '10px' }}
            className={classes.button}
          >
            BUY POLAR
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button} style={{ marginRight: '10px' }}>
            BUY SPOLAR
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button} style={{ marginRight: '10px' }}>
            POLAR CHARTS
          </Button>
          <Button color="secondary" variant="contained" target="_blank" href={buyTShareAddress} className={classes.button}>
            SPOLAR CHARTS
          </Button>
          
        </Grid>

        {/* TOMB */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TOMB');
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
                      <TokenSymbol symbol="TOMB" />
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
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TSHARE');
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
                      <TokenSymbol symbol="TSHARE" />
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
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TBOND');
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
                      <TokenSymbol symbol="TBOND" />
                    </CardIcon>
                  </Box>          
                  <h2>SPOLAR</h2>
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