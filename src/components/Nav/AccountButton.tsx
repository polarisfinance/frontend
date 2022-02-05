import React from 'react';
import { Button } from '@material-ui/core';

interface AccountButtonProps {
  text?: string;
}

const AccountButton: React.FC<AccountButtonProps> = ({ text }) => {


  const buttonText = text ? text : 'Unlock';

  return (
    <div>

      <Button color="primary" variant="contained">
        {buttonText}
      </Button>


    </div>
  );
};

export default AccountButton;
