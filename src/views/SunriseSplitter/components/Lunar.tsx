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

const Stake: React.FC = () => {
  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <Grid container item justify="center">
                <Image
                  color="none"
                  imageStyle={{ height: '50px', width: '50px' }}
                  style={{ height: '50px', width: '50px', paddingTop: '0px', marginTop: '20px' }}
                  src={Fire}
                />
                <CardIcon>
                  <TokenSymbol symbol="LUNAR" />
                </CardIcon>
                <Image
                  color="none"
                  imageStyle={{ height: '50px', width: '50px' }}
                  style={{ height: '50px', width: '50px', paddingTop: '0px', marginTop: '20px' }}
                  src={Fire}
                />
              </Grid>
              <Value value={'LUNAR Sunrise'} />
              <Label text="Stake your $SPOLAR to earn $LUNAR" />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                component={Link}
                to={'/lunar_sunrise'}
              >
                View and Stake
              </Button>
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
