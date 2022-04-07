import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
const CemeteryCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Card>
        <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
          <Grid container alignItems="center">
            <Grid container item sm={4} alignItems="center">
              <Box mr={5} ml={5} mt={2}>
                <CardIcon>
                  <TokenSymbol symbol={bank.depositTokenName} />
                </CardIcon>
              </Box>
              <Typography variant="h5" component="h2">
                {bank.depositTokenName}
              </Typography>
            </Grid>

            <Grid item sm={4}>
              <Typography color="textSecondary">
                {/* {bank.name} */}
                Deposit {bank.depositTokenName.toUpperCase()} Earn {` ${bank.earnTokenName}`}
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Button color="primary" size="small" variant="contained" component={Link} to={`/dawn/${bank.contract}`}>
                VIEW & STAKE
              </Button>
              {bank.depositTokenName.startsWith('POLAR-STNEAR') && (
                <Box style={{ marginTop: '10px' }}>
                  <StyledLink href={'https://metapool.app/dapp/mainnet/metapool-aurora/'} target="_blank">
                    Get STNEAR ↗
                  </StyledLink>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: white;
  text-decoration: underline;
`;
export default CemeteryCard;
