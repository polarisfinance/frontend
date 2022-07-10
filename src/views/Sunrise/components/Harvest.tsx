import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerSunrise from '../../../hooks/masonry/useClaimRewardTimerSunrise';
import useClaimRewardCheck from '../../../hooks/masonry/useClaimRewardCheck';
import ProgressCountdown from './ProgressCountdown';
import useClaimRewardFromSunrise from '../../../hooks/useClaimRewardFromSunrise';
import useEarningsOnSunrise from '../../../hooks/useEarningsOnSunrise';
import useStats from '../../../hooks/useStats';
import { getDisplayBalance } from '../../../utils/formatBalance';

const Harvest = ({ sunrise }) => {
  const tombStats = useStats(sunrise.earnTokenName);
  const { onReward } = useClaimRewardFromSunrise(sunrise);
  const earnings = useEarningsOnSunrise(sunrise);
  const canClaimReward = useClaimRewardCheck(sunrise);

  const tokenPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings, 18, 18))).toFixed(2);

  const { from, to } = useClaimRewardTimerSunrise(sunrise);
  let earnTokenName;
  if (sunrise.earnTokenName.startsWith('OLD')) {
    earnTokenName = sunrise.earnTokenName.slice(3);
  } else {
    earnTokenName = sunrise.earnTokenName;
  }
  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol={sunrise.earnTokenName} />
              </CardIcon>
              {sunrise.earnTokenName === 'ORBITAL' ? (
                <Value value={getDisplayBalance(earnings, 18, 6)} />
              ) : (
                <Value value={getDisplayBalance(earnings)} />
              )}

              <Label text={`≈ $${earnedInDollars}`} />
              <Label text={`${earnTokenName} Earned`} />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                onClick={onReward}
                color="primary"
                variant="contained"
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      <Box mt={2} style={{ color: '#FFF' }}>
        {canClaimReward ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{ textAlign: 'center' }}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
