import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
  background-color: rgba(71, 32, 123, 0.9); //${(props) => props.theme.color.grey[800]};
  color: #ffffff !important;
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 10px !important;
`;

export default Card;
