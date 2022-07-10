import React from 'react';

import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';

import { Grid } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import { Button } from '@material-ui/core';
import AccountModalCard from './AccountModalCard';

const AccountModal: React.FC<ModalProps> = ({ onDismiss, sunrises }) => {
  const { reset } = useWallet();
  const activeSunrises = sunrises.filter((sunrise) => !sunrise.coming).filter((sunrise) => !sunrise.retired);
  return (
    <Modal>
      <ModalTitle text="My Wallet" />
      <Button
        onClick={() => {
          reset();
          onDismiss();
        }}
        variant="contained"
        style={{ position: 'absolute', top: '18px', right: '18px', backgroundColor: '#b43387', color: '#FFF' }}
      >
        Disconnect
      </Button>

      <Grid style={{ maxHeight: '80vh', overflow: 'auto' }} container justify="center">
        <AccountModalCard token="SPOLAR" />
        {activeSunrises.map((sunrise) => (
          <React.Fragment key={sunrise.earnTokenName}>
            <AccountModalCard token={sunrise.earnTokenName} />
          </React.Fragment>
        ))}
        {activeSunrises.map((sunrise) => (
          <React.Fragment key={sunrise.bond}>
            <AccountModalCard token={sunrise.bond} />
          </React.Fragment>
        ))}
      </Grid>
    </Modal>
  );
};

export default AccountModal;
