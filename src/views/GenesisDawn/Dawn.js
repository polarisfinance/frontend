import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Container, Typography, Grid, Button } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CemeteryCard from './DawnCard';
import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';
import HomeImage from '../../assets/img/home.png';

import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
  
  a:link, a:visited {
    color: white;
    text-decoration: underline;
    cursor: pointer;
  }
  
  a:link:active, a:visited:active {
    color: white;
  }

`;

const Cemetery = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                BINARIS Genesis
              </Typography>
              <Grid item xs={12} sm={12} style={{ margin: '12px' }}>
                <Alert style={{ backgroundColor: '#b43387', fontSize: '20px' }} variant="filled" severity="warning">
                  {/* <b>All below pools have ended. Please unstake and collect your rewards.</b> */}
                  <b>23.07.2022 14:00 UTC - 24.07.2022 14:00 UTC</b>
                  <p>
                    You can bridge BNB via{' '}
                    <a href="https://app.allbridge.io/bridge?from=BSC&to=AURO&asset=BNB">Allbridge</a>
                  </p>
                  <p>
                    We have deployed and seeded with $ 50k BINARIS/USP LP as well. Routing is not live yet, if you want
                    to buy BINARIS you can swap any asset to USP and then buy BINARIS from this pool.
                  </p>
                </Alert>
              </Grid>
              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 10).length === 0}>
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 10)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <Grid container direction="row" alignItems="flex-end">
                  <Grid item align="center" xs={12}>
                    <Button
                      color="primary"
                      href="/legacy_dawn"
                      variant="contained"
                      style={{
                        marginTop: '30px',
                        /* 
                          backgroundColor: 'rgb(0,0,0,0)',
                          boxShadow: 'none',
                          */
                      }}
                    >
                      Legacy Dawn
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;
