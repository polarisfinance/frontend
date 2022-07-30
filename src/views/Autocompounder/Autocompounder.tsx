import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AcBank from '../AcBank';

import { Box, Container, Typography, Grid, Button } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CemeteryCard from './AcCard';
import { createGlobalStyle } from 'styled-components';

import useAcBanks from '../../hooks/useAcBanks';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch as MuiSwitch } from '@material-ui/core';
const Style = createGlobalStyle`
  .MuiFormControlLabel-label {
    color: white;
  }
`;

const Autocompounder = () => {
  const [banks] = useAcBanks();
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
                Autocompounder
              </Typography>
              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '20px' }}
                  >
                    Autocompound your LPs
                  </Typography>
                  <FormGroup row>
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
                      style={{ marginBottom: '15px' }}
                    />
                  </FormGroup>
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard acBank={bank} onlyStaked={state.onlyStaked} />
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
        <Route path={`${path}/:acBankId`}>
          <AcBank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Autocompounder;
