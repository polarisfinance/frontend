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
            <Grid container item xs={12} md={4} alignItems="center">
              <Box mr={5} ml={5} mt={2}>
                <CardIcon>
                  <TokenSymbol symbol={bank.depositTokenName} />
                </CardIcon>
              </Box>
              <Typography variant="h5" component="h2">
                {bank.depositTokenName}
              </Typography>
            </Grid>

            <Grid container item xs={12} md={6} alignItems="center">
              <Typography color="textSecondary">
                {/* {bank.name} */}
                Deposit {bank.depositTokenName} Earn {` ${bank.earnTokenName}`}
              </Typography>
            </Grid>
            <Grid container item xs={12} md={2}>
              <Button color="primary" size="small" variant="contained" component={Link} to={`/dawn/${bank.contract}`}>
                VIEW & STAKE
              </Button>

              {bank.depositTokenName.startsWith('WETH') && (
                <Box style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <StyledLink
                    href={
                      'https://wannaswap.finance/exchange/swap/swap?inputCurrency=ETH&outputCurrency=0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'
                    }
                    target="_blank"
                  >
                    Get WETH ↗
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
