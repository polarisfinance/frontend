import React, { useCallback, useMemo, useState } from 'react';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import Label from '../../../components/Label';
import { Box, Button, makeStyles } from '@material-ui/core';

interface ExchangeModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  title: string;
  description: string;
  action: string;
  tokenName: string;
}

const useStyles = makeStyles((theme) => ({
  cancelButton: (props) => ({
    backgroundColor: '#ba0100',
    color: 'white',
    padding: '0.5em',
    fontSize: 'larger',
    margin: '1em',
  }),
  actionButton: (props) => ({
    backgroundColor: '#70D44B',
    color: 'white',
    padding: '0.5em',
    fontSize: 'larger',
    margin: '1em',
  }),
}));

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  max,
  title,
  description,
  onConfirm,
  onDismiss,
  action,
  tokenName,
}) => {
  const classes = useStyles();
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => getFullDisplayBalance(max), [max]);

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => setVal(e.currentTarget.value), [setVal]);

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal>
      <ModalTitle text={title} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <Label text={description} />
      <ModalActions>
        <Box style={{ textAlign: 'center' }}>
          <Button className={classes.cancelButton} variant="contained" onClick={onDismiss}>
            Cancel
          </Button>
          <Button className={classes.actionButton} onClick={() => onConfirm(val)} variant="contained">
            {action}
          </Button>
        </Box>
      </ModalActions>
    </Modal>
  );
};

export default ExchangeModal;
