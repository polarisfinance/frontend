import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CemeteryCard from './DawnCard';
import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';
import HomeImage from '../../assets/img/home.png';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
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
                Legacy Dawn
              </Typography>

              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Alert
                    style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#b43387', fontSize: '20px' }}
                    variant="filled"
                    severity="warning"
                  >
                    <b>All below pools have ended. Please unstake and collect your rewards.</b>
                  </Alert>
                </div>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 6).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    ETHERNAL Genesis Pools
                  </Typography>
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 6)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 3).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    TRIPOLAR Genesis Pools
                  </Typography>
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 3)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 5).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Earn SPOLAR by staking LP
                  </Typography>

                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 5)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 4).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    LUNAR Genesis Pools
                  </Typography>

                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 4)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Earn POLAR by staking LP
                  </Typography>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    POLAR Genesis Pools
                  </Typography>

                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
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
