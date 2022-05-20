import React, { useMemo } from 'react';
import usePolarisFinance from '../../hooks/usePolarisFinance';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import styled from 'styled-components';
import TokenSymbol from '../TokenSymbol';
import Label from '../Label';

const AccountModalCard = ({ token }) => {
  const polarisFinance = usePolarisFinance();
  const tokenBalance = useTokenBalance(polarisFinance[token]);
  const displayTokenBalance = useMemo(() => getDisplayBalance(tokenBalance), [tokenBalance]);

  return (
    <StyledBalanceWrapper>
      <TokenSymbol symbol={token} />
      <StyledBalance>
        <StyledValue>{displayTokenBalance}</StyledValue>
        <Label text={`${token} Available`} />
      </StyledBalance>
    </StyledBalanceWrapper>
  );
};
const StyledValue = styled.div`
  //color: rgba(71,32,123,0.9);
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 16px;
`;
export default AccountModalCard;
