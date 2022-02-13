import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../tomb-finance';
import useTombFinance from '../../hooks/useTombFinance';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  text: {
    fontSize: '40px',
  }
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  return account && bank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      <Grid container>
        <Grid item xs={4}>
          <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
        </Grid>
  
        <Grid container item xs={4} alignItems="center" direction="row">
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end" >
              <Typography className={classes.text}>APR:</Typography>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Typography className={classes.text}>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end" >
              <Typography className={classes.text}>Daily APR:</Typography>
            </Grid>
            <Grid item xs={6} container justify='center'>
              <Typography className={classes.text}>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} container justify="flex-end">
              <Typography className={classes.text}>TVL:</Typography>
            </Grid>
            <Grid item xs={6} container justify='center'>
              <Typography className={classes.text}>${statsOnPool?.TVL}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <StyledCardWrapper>
            <Harvest bank={bank} />
          </StyledCardWrapper>
        </Grid>
        <Grid item xs={12}>
          <StyledBank>
            {bank.depositTokenName.includes('LP') && <LPTokenHelpText  bank={bank} />}
            <div style={{marginTop: '20px'}}>
              <Button onClick={onRedeem} color="primary" variant="contained">
                Claim & Withdraw
              </Button>
            </div>
          </StyledBank>
        </Grid>
        
      
      </Grid>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const tombFinance = useTombFinance();
  const tombAddr = tombFinance.TOMB.address;
  const tshareAddr = tombFinance.TSHARE.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName === 'POLAR-NEAR-LP') {
    pairName = 'POLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tombAddr;
  } else {
    pairName = 'SPOLAR-NEAR pair';
    uniswapUrl = 'https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/' + tshareAddr;
  }
  return (
        <StyledLink style={{marginTop: '20px'}} href={uniswapUrl} target="_blank">
          {`Provide liquidity for ${pairName} now on Trisolaris`}
        </StyledLink>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
