import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

import { getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface WithdrawModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: BigNumber) => void;
  tokenName?: string;
  decimals?: number;
  multiplyer: BigNumber;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  multiplyer,
  tokenName = '',
  decimals = 18,
}) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    return getDisplayBalance(max, decimals, 10, false);
  }, [max, decimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);
  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />

      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            onConfirm(
              BigNumber.from('0x' + (Number(val) * 10 ** 18).toString(16).toUpperCase())
                .mul(multiplyer)
                .div(BigNumber.from(10).pow(18)),
            )
          }
        >
          Confirm
        </Button>
        {/* <Button color="secondary" onClick={onDismiss}>Cancel</Button> */}

        {/* <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button text="Confirm" onClick={() => onConfirm(val)} /> */}
      </ModalActions>
    </Modal>
  );
};

export default WithdrawModal;
