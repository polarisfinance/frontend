import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';

import useStatsForPool from '../../hooks/useStatsForPool';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useTombStats from '../../hooks/useTombStats';
import useShareStats from '../../hooks/usetShareStats';
import useLunarStats from '../../hooks/useLunarStats';
import useTripolarStats from '../../hooks/useTripolarStats';

const CemeteryCard = ({ bank }) => {
  const statsOnPool = useStatsForPool(bank);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const tombStats = useTombStats();
  const tShareStats = useShareStats();
  const lunarStats = useLunarStats();
  const tripolarStats = useTripolarStats();
  let tokenName;
  if (bank.earnTokenName === 'SPOLAR') {
    tokenName = 'SPOLAR';
  } else if (bank.earnTokenName === 'POLAR') {
    tokenName = 'POLAR';
  } else if (bank.earnTokenName === 'LUNAR') {
    tokenName = 'LUNAR';
  } else if (bank.earnTokenName === 'TRIPOLAR') {
    tokenName = 'TRIPOLAR';
  }
  var tokenStats;
  if (bank.earnTokenName === 'SPOLAR') {
    tokenStats = tShareStats;
  } else if (bank.earnTokenName === 'POLAR') {
    tokenStats = tombStats;
  } else if (bank.earnTokenName === 'LUNAR') {
    tokenStats = lunarStats;
  } else if (bank.earnTokenName === 'TRIPOLAR') {
    tokenStats = tripolarStats;
  }
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const bankDepositName = bank.depositTokenName.slice(0, -3);
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Card>
        <CardContent align="center" style={{ position: 'relative', paddingBottom: '16px' }}>
          <Grid container alignItems="center">
            <Grid container item xs={12} sm={4} alignItems="center">
              <Box mr={5} ml={5} mt={2}>
                <CardIcon>
                  <TokenSymbol symbol={bank.depositTokenName} />
                </CardIcon>
              </Box>
              <Typography variant="h5" component="h2">
                {bankDepositName}
              </Typography>
            </Grid>
            <Grid container item xs={12} sm={4} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="h5" component="h2">
                  Daily:
                </Typography>
                <Typography variant="h6" component="h2">
                  {bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" component="h2">
                  APR:
                </Typography>
                <Typography variant="h6" component="h2">
                  {bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" component="h2">
                  TVL:
                </Typography>
                <Typography variant="h6" component="h2">
                  ${statsOnPool?.TVL}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item sm={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  To Claim:
                </Typography>
              </Grid>
              <Grid container item xs={12} justify="center" alignItems="center">
                <Grid item>
                  <Typography variant="h6" component="h2" style={{ marginRight: '5px' }}>
                    {`${Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal)).toFixed(2)}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="h6">
                    {` ≈ $${earnedInDollars}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={1}>
              <Button onClick={onReward} disabled={earnings.eq(0)} size="small" color="primary" variant="contained">
                Claim
              </Button>
            </Grid>
            <Grid item xs={12} sm={1}>
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
