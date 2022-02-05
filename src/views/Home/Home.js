import React from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import Logo from '../../logo.svg'
import Image from 'material-ui-image';
import { createGlobalStyle } from 'styled-components';

import { Box, Grid, Paper,Typography } from '@material-ui/core';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;



const Home = () => {
  
  return (
    <Page>
      <BackgroundImage />

      <Grid
        container
        spacing={0}
        align="center"
        justify="center"
        direction="column"
        
      >


        <Grid item>
          <Image color="none" style={{ width: '300px',height: '300px', paddingTop: '0px' }} src={Logo} />
          <Box mt={5}>
            <Typography sx={{ mt: 10 }} color="textPrimary" align="center" variant="h3">
              Comming soon
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;