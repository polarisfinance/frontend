import React from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent } from '@material-ui/core';
import CardIcon from '../../../components/CardIcon';

import Label from '../../../components/Label';
import Value from '../../../components/Value';

import TokenSymbol from '../../../components/TokenSymbol';
import { Link } from 'react-router-dom';

const Stake: React.FC = () => {
  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="TRIBOND" />
              </CardIcon>
              <Value value={'TRIBOND BOND'} />
              <Label text="BOND room for $TRIPOLAR" />
            </StyledCardHeader>
            <StyledCardActions>
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
