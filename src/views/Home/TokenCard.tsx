import React, { useMemo } from 'react';

import { Box, Button, Card, CardContent, Grid } from '@material-ui/core';

import CardIcon from '../../components/CardIcon';

import TokenSymbol from '../../components/TokenSymbol';

import { makeStyles } from '@material-ui/core/styles';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import useStats from '../../hooks/useStats';
import MetamaskFox from '../../assets/img/metamask-fox.svg';

const useStyles = makeStyles((theme) => ({
  box: {
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

function numberWithSpaces(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

const Stake = ({ token, bond, tokenAddress, lpAddress }) => {
  const classes = useStyles();
  const polarisFinance = usePolarisFinance();
  const tokenStats = useStats(token);
  const tokenPriceInNear = useMemo(() => (tokenStats ? Number(tokenStats.tokenInFtm).toFixed(4) : null), [tokenStats]);
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? String(Number(tokenStats.priceInDollars).toFixed(2)) : null),
    [tokenStats],
  );
  const tokenCirculatingSupply = useMemo(
    () => (tokenStats ? Number(tokenStats.circulatingSupply) : null),
    [tokenStats],
  );
  const tokenTotalSupply = useMemo(() => (tokenStats ? String(tokenStats.totalSupply) : null), [tokenStats]);

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Card>
          <CardContent style={{ position: 'relative', paddingBottom: '16px' }}>
            <Grid container justify="center" alignItems="center">
              <Grid container item xs={12} sm={4} className={classes.icon}>
                <Box mr={5} ml={5} mt={2}>
                  <CardIcon>
                    <TokenSymbol symbol={token} />
                  </CardIcon>
                </Box>
                <h2>{token}</h2>
              </Grid>
              <Grid container item xs={12} sm={3} direction="column" alignItems="center">
                <Grid item>Current Price</Grid>
                <Grid item>
                  <Box>
                    <span style={{ fontSize: '30px' }}>{tokenPriceInNear ? tokenPriceInNear : '-.----'} NEAR</span>
                  </Box>
                </Grid>
                <Grid item>
                  <Box>
                    <span style={{ fontSize: '20px' }}>${tokenPriceInDollars ? tokenPriceInDollars : '-.--'}</span>
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={3} direction="column" alignItems="center">
                <Grid item>Market Cap:</Grid>
                <Grid item>
                  <Box>
                    <span style={{ fontSize: '30px' }}>
                      ${numberWithSpaces((tokenCirculatingSupply * Number(tokenPriceInDollars)).toFixed(2))}
                    </span>
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={2} direction="column" alignItems="center">
                {!token.endsWith('BOND') ? (
                  <>
                    <Grid item xs={4} sm={12}>
                      <Button
                        onClick={() => {
                          polarisFinance.watchAssetInMetamask(token);
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
                        href={`https://www.trisolaris.io/#/swap?outputCurrency=${tokenAddress}`}
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
                        href={`https://dexscreener.com/aurora/${lpAddress}`}
                        className={classes.button}
                        style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                      >
                        CHART
                      </Button>
                    </Grid>{' '}
                  </>
                ) : (
                  <>
                    <Grid item xs={4} sm={12}>
                      <Button
                        onClick={() => {
                          polarisFinance.watchAssetInMetamask(token);
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
                        href={`/bond/${bond}`}
                        className={classes.button}
                        style={{ minWidth: '70px', maxWidth: '70px', marginTop: '12px' }}
                      >
                        BOND
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid container justify="flex-end">
        <Grid item>
          <span style={{ fontSize: '20px', marginRight: '20px' }}>Circulating Supply: {tokenCirculatingSupply}</span>
        </Grid>
        <Grid item>
          <span style={{ fontSize: '20px', paddingRight: '12px' }}>Total Supply: {tokenTotalSupply}</span>
        </Grid>
      </Grid>
    </>
  );
};

export default Stake;
