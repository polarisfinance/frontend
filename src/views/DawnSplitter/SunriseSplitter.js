import React from 'react';
import { useWallet } from 'use-wallet';

import GenesisDawn from './components/GenesisDawn';
import ActiveDawn from './components/ActiveDawn';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

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
      <BackgroundImage />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Dawn
          </Typography>
          <Grid container className={classes.text}>
            <Grid container item xs={12} justify="center" className={classes.text}></Grid>
            <Grid item xs={12} md={6} style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}>
              <ActiveDawn />
            </Grid>

            <Grid item xs={12} md={6} style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}>
              <GenesisDawn />
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
