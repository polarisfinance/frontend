import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import Container from '../Container';
import { SunriseInfo } from '../../polaris-finance/types';
export interface ModalProps {
  onDismiss?: () => void;
  sunrises?: Array<SunriseInfo>;
}

const Modal: React.FC = ({ children }) => {
  return (
    <Container size="sm">
      <StyledModal>
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </StyledModal>
    </Container>
  );
};

const StyledModal = styled.div`
  border-radius: 10px !important;
  position: relative;
`;

export default Modal;
