import React from 'react';
import { Button } from '@material-ui/core';

interface AccountButtonProps {
  text?: string;
}

const AccountButton: React.FC<AccountButtonProps> = ({ text }) => {


  const buttonText = text ? text : 'Unlock';

  return (
    <div>
      {!account ? (
        <Button onClick={handleWalletProviderOpen} color="primary" variant="contained">
          {buttonText}
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={onPresentAccountModal}>
          My Wallet
        </Button>
      )}

      <WalletProviderModal open={isWalletProviderOpen} handleClose={handleWalletProviderClose} />
      {/* <AccountModal open={isAccountModalOpen} handleClose={handleAccountModalClose}/> */}
    </div>
  );
};

export default AccountButton;
