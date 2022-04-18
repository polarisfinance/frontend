import React from 'react';
import { useWallet } from 'use-wallet';

import Lunar from './components/Lunar';
import Polar from './components/Polar';
import Auris from './components/Auris';
import Tribond from './components/Tribond';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';

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

  return (
    <Page>
      <BackgroundImage style={{ height: '100%', width: '100%', flex: 1 }} />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Bond
          </Typography>
          <Grid container className={classes.text}>
            <Grid
              item
              xs={12}
              md={4}
              justify="center"
              style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}
            >
              <Polar />
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              justify="center"
              style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}
            >
              <Lunar />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              justify="center"
              style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}
            >
              <Tribond />
            </Grid>
          </Grid>
          <Grid container className={classes.text}>
            <Grid
              item
              xs={12}
              md={4}
              justify="center"
              style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}
            >
              <Auris />
            </Grid>
          </Grid>
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

export default Masonry;
