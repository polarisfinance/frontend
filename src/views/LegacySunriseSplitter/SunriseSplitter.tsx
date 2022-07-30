import React from 'react';
import { useWallet } from 'use-wallet';

import SunriseCard from './components/SunriseCard';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useSunrises from '../../hooks/useSunrises';
import Sunrise from '../Sunrise';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Alert } from '@material-ui/lab';

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
  const [sunrises] = useSunrises();
  const { path } = useRouteMatch();
  const activeSunrises = sunrises.filter((sunrise) => sunrise.retired);
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          {!!account ? (
            <>
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Legacy Sunrise
              </Typography>
              <Alert
                style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
                variant="filled"
                severity="warning"
              >
                <b>All below sunrises have been retired. Please unstake and collect your rewards.</b>
              </Alert>
              <Grid container className={classes.text}>
                {activeSunrises.map((sunrise) => (
                  <React.Fragment key={sunrise.earnTokenName}>
                    <Grid item xs={12} md={4} style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}>
                      <SunriseCard sunrise={sunrise} />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:sunriseId`}>
          <Sunrise />
        </Route>
      </Page>
    </Switch>
  );
};

export default Masonry;
