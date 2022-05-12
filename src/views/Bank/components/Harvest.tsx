import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button, Card, CardContent } from '@material-ui/core';
// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../polaris-finance';
import useStats from '../../../hooks/useStats';
interface HarvestProps {
  bank: Bank;
}

const Harvest: React.FC<HarvestProps> = ({ bank }) => {
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const tombStats = useStats('POLAR');
  const tShareStats = useStats('SPOLAR');
  const lunarStats = useStats('LUNAR');
  const tripolarStats = useStats('TRIPOLAR');
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
  var tokenStats: { priceInDollars: any; tokenInFtm?: string; totalSupply?: string; circulatingSupply?: string };
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
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.earnTokenName} />
            </CardIcon>
            <Value value={getDisplayBalance(earnings)} />
            <Label text={`≈ $${earnedInDollars}`} />
            <Label text={`${tokenName} Earned`} />
          </StyledCardHeader>
          <StyledCardActions>
            <Button onClick={onReward} disabled={earnings.eq(0)} color="primary" variant="contained">
              Claim
            </Button>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
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
