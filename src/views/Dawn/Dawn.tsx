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

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch as MuiSwitch } from '@material-ui/core';
const Style = createGlobalStyle`
  .MuiFormControlLabel-label {
    color: white;
  }
`;

const Cemetery = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);

  const [state, setState] = React.useState({
    onlyStaked: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <Style />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Dawn
              </Typography>
              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Earn SPOLAR by staking your assets
                  </Typography>
                  <Grid container direction="row">
                    {' '}
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <MuiSwitch
                            checked={state.onlyStaked}
                            onChange={handleChange}
                            name="onlyStaked"
                            color="primary"
                          />
                        }
                        label="Only show staked LP"
                      />
                    </Grid>
                    <Grid item style={{ textAlign: 'right', marginBottom: '15px' }} xs={6}>
                      <Button color="primary" href="/autocompounder" variant="contained">
                        Autocompounder
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} onlyStaked={state.onlyStaked} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
                <Grid container direction="row" alignItems="flex-end">
                  <Grid item style={{ textAlign: 'center' }} xs={12}>
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
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;
