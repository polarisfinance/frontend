import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
import useStatsForPool from '../../hooks/useStatsForPool';

const CemeteryCard = ({ bank }) => {
  const statsOnPool = useStatsForPool(bank);
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Card>
        <CardContent style={{ textAlign: 'center', position: 'relative', paddingBottom: '16px' }}>
          {localStorage.getItem('devMode') === 'true' && (
            <>
              <Box style={{ position: 'absolute', bottom: '10px', right: '20px' }}>TVL: ${statsOnPool?.TVL}</Box>
            </>
          )}
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CemeteryCard;
