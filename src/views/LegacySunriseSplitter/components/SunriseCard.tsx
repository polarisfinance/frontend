import React from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Grid } from '@material-ui/core';

import CardIcon from '../../../components/CardIcon';

import Label from '../../../components/Label';
import Value from '../../../components/Value';

import TokenSymbol from '../../../components/TokenSymbol';
import { Link } from 'react-router-dom';
import Image from 'material-ui-image';
import Fire from '../../../assets/img/fire.gif';
import useTotalStakedOnSunrise from '../../../hooks/useTotalStakedOnSunrise';
import { getDisplayBalance } from '../../../utils/formatBalance';

const Stake = ({ sunrise }) => {
  let earnTokenName;
  if (sunrise.earnTokenName.startsWith('OLD')) {
    earnTokenName = sunrise.earnTokenName.slice(3);
  } else {
    earnTokenName = sunrise.earnTokenName;
  }
  const totalStaked = useTotalStakedOnSunrise(sunrise);

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <Grid container item justify="center">
                {sunrise.boosted ? (
                  <>
                    <Image
                      color="none"
                      imageStyle={{ height: '50px', width: '50px' }}
                      style={{ height: '50px', width: '50px', paddingTop: '0px', marginTop: '20px' }}
                      src={Fire}
                      animationDuration={0}
                      disableTransition={true}
                      disableSpinner={true}
                    />
                    <CardIcon>
                      <TokenSymbol symbol={sunrise.earnTokenName} />
                    </CardIcon>
                    <Image
                      color="none"
                      imageStyle={{ height: '50px', width: '50px' }}
                      style={{ height: '50px', width: '50px', paddingTop: '0px', marginTop: '20px' }}
                      src={Fire}
                      animationDuration={0}
                      disableTransition={true}
                      disableSpinner={true}
                    />
                  </>
                ) : (
                  <CardIcon>
                    <TokenSymbol symbol={sunrise.earnTokenName} />
                  </CardIcon>
                )}
              </Grid>
              <Value value={`${earnTokenName} Sunrise`} />
              {sunrise.retired ? (
                <Label text={`Please withdraw your SPOLAR`} />
              ) : (
                <Label text={`Stake your $SPOLAR to earn $${earnTokenName}`} />
              )}
              {localStorage.getItem('devMode') === 'true' && !sunrise.coming && (
                <>
                  <Box style={{ marginTop: '10px', bottom: '0px', top: '0px' }}>
                    Spolar Staked: {getDisplayBalance(totalStaked)}
                  </Box>
                </>
              )}
            </StyledCardHeader>
            <StyledCardActions>
              {sunrise.coming ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  component={Link}
                  to={'/polar_sunrise'}
                  disabled={true}
                >
                  Coming Soon
                </Button>
              ) : sunrise.retired ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  component={Link}
                  to={`/sunrise/${sunrise.name}`}
                >
                  Unstake
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  component={Link}
                  to={`/sunrise/${sunrise.name}`}
                >
                  View and Stake
                </Button>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
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
  margin-top: 28px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
