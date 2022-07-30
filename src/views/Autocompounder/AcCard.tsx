import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';

import useStatsForPool from '../../hooks/useStatsForPool';
import { getDisplayBalance } from '../../utils/formatBalance';

import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useStats from '../../hooks/useStats';

import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useStakedBalance from '../../hooks/useStakedBalance';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import useStatsForVault from '../../hooks/useStatsForVault';
import useDepositedBalance from '../../hooks/useDepositedBalance';

const CemeteryCard = ({ acBank, onlyStaked }) => {
  const statsOnPool = useStatsForVault(acBank);

  const { onReward } = useHarvest(acBank);

  let bankDepositName;
  if (acBank.depositTokenName.endsWith('LP')) {
    bankDepositName = acBank.depositTokenName.slice(0, -3);
  } else {
    bankDepositName = acBank.depositTokenName;
  }
  const stakedBalance = useDepositedBalance(acBank.contract);

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(acBank.depositTokenName, acBank.depositToken);
  const stakedInDollars = (
    Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, acBank.depositToken.decimal, 18))
  ).toFixed(2);
  if (Number(stakedInDollars).toFixed(2) !== '0.00' || onlyStaked === false) {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <Card>
          <CardContent style={{ position: 'relative', paddingBottom: '16px', textAlign: 'center' }}>
            {acBank.depositTokenName.startsWith('POLAR-STNEAR') && (
              <Box style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <StyledLink href={'https://metapool.app/dapp/mainnet/metapool-aurora/'} target="_blank">
                  Get STNEAR ↗
                </StyledLink>
              </Box>
            )}
            {acBank.depositTokenName.startsWith('BNB') && (
              <Box style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <StyledLink href={'https://app.allbridge.io/bridge?from=BSC&to=AURO&asset=BNB'} target="_blank">
                  BRIDGE BNB ↗
                </StyledLink>
              </Box>
            )}

            <Grid container alignItems="center">
              <Grid container item xs={12} md={4} alignItems="center">
                <Box mr={5} ml={5} mt={2}>
                  <CardIcon>
                    <TokenSymbol symbol={acBank.depositTokenName} />
                  </CardIcon>
                </Box>
                <Typography variant="h5" component="h2">
                  {bankDepositName}
                </Typography>
              </Grid>

              <Grid container item xs={12} md={6} alignItems="center">
                <Grid item xs={4} sm={3}>
                  <Typography variant="h5" component="h2">
                    Daily:
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {acBank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Typography variant="h5" component="h2">
                    APY:
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {acBank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Typography variant="h5" component="h2">
                    TVL:
                  </Typography>
                  <Typography variant="h6" component="h2">
                    ${statsOnPool?.TVL}
                  </Typography>
                </Grid>
                <Grid container item xs={12} sm={3} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h2">
                      Staked:
                    </Typography>
                  </Grid>
                  <Grid container item xs={12} justify="center" alignItems="center">
                    <Grid item>
                      <Typography variant="h6" component="h2" style={{ marginRight: '5px' }}>
                        {`${Number(getDisplayBalance(stakedBalance)).toFixed(2)}`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" component="h6">
                        {` ≈ $${stakedInDollars}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container item xs={12} md={2}>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    component={Link}
                    to={`/autocompounder/${acBank.contract}`}
                  >
                    VIEW
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  } else {
    return null;
  }
};
const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: white;
  text-decoration: underline;
`;
export default CemeteryCard;
