import React from 'react';
import { useWallet } from 'use-wallet';

import BondCard from './components/BondCard';

import { makeStyles } from '@material-ui/core/styles';

import { Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import useSunrises from '../../hooks/useSunrises';
import Bond from '../Bond';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

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
  const [sunrises] = useSunrises();
  const { path } = useRouteMatch();
  const aciteSunrises = sunrises.filter((sunrise) => !sunrise.retired);
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          {!!account ? (
            <>
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Bond
              </Typography>

              <Grid container className={classes.text}>
                {aciteSunrises.map((sunrise) => (
                  <React.Fragment key={sunrise.earnTokenName}>
                    <Grid item xs={12} md={4} style={{ paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px' }}>
                      <BondCard sunrise={sunrise} />
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
          <Bond />
        </Route>
      </Page>
    </Switch>
  );
};

export default Masonry;
