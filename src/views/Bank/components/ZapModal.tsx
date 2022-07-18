import React, { useState, useMemo, useEffect, useCallback } from 'react';

import { Button, MenuItem, withStyles, makeStyles, TextField } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import usePolarisFinance from '../../../hooks/usePolarisFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { POLAR_TICKER, SPOLAR_TICKER, FTM_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string) => void;
  lpName?: string;
  decimals?: number;
}

const useStyles = makeStyles({
  root: {},
  container: {},
  zapEstimates: {
    marginTop: '0.5em',
    textAlign: 'center',
    padding: '0.6em',
    fontSize: '30px',
  },
  button: {
    textAlign: 'center',
    margin: '-2em',
    marginBottom: '0.5em',
  },
});

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, lpName = '', decimals = 18 }) => {
  const tokenName = lpName.match(/^(.*?)-/)[1];
  const nativeName = lpName.match(/-(.*)-/)[1];
  const polarisFinance = usePolarisFinance();
  const { balance } = useWallet();

  const [val, setVal] = useState('');

  const [zappingToken, setZappingToken] = useState(tokenName);

  const [zappingTokenBalance, setZappingTokenBalance] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (zappingToken === 'ETH') {
        const ethBalance = (Number(balance) / 1e18).toFixed(4).toString();
        setZappingTokenBalance(ethBalance);
      } else {
        setZappingTokenBalance(
          getDisplayBalance(
            await polarisFinance.externalTokens[zappingToken].balanceOf(polarisFinance.myAccount),
            polarisFinance.externalTokens[zappingToken].decimal,
          ),
        );
      }
      console.log('executed');
    };
    fetchBalance().catch(console.error);
  }, [zappingToken, balance, polarisFinance.externalTokens, polarisFinance.myAccount]);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be FTM in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);

  const tombFtmLpStats = useLpStats('POLAR-NEAR-LP');
  const tShareFtmLpStats = useLpStats('SPOLAR-NEAR-LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = lpName.startsWith(POLAR_TICKER) ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;

  const classes = useStyles();
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = async (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === '0') {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    } else {
      console.log(e.currentTarget.value);
      if (!isNumeric(e.currentTarget.value)) console.log('non nummeric');
      setVal(e.currentTarget.value);
      const estimateZap = await polarisFinance.estimateZapIn(zappingToken, lpName, String(e.currentTarget.value));
      setEstimate({
        token0: estimateZap[0],
        token1: estimateZap[1],
      });
    }
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await polarisFinance.estimateZapIn(zappingToken, lpName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal>
      <Alert variant="filled" severity="warning" style={{ marginBottom: '1em' }}>
        Beta feature. Use at your own risk!
      </Alert>
      <ModalTitle text={`Zap in ${lpName}`} />
      <TextField
        select
        label="Select asset to zap with"
        value={zappingToken}
        onChange={handleChangeAsset}
        variant="outlined"
      >
        <StyledMenuItem value={`${tokenName}`}>{tokenName}</StyledMenuItem>
        <StyledMenuItem value={`${nativeName}`}>{nativeName}</StyledMenuItem>
      </TextField>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <div className={classes.zapEstimates}>
        <Label text="Zap Estimations" />
        <StyledDescriptionText>
          {' '}
          {lpName}: {Number(estimate.token0) / Number(ftmAmountPerLP)}
        </StyledDescriptionText>
        <StyledDescriptionText>
          {' '}
          ({Number(estimate.token0)} {tokenName} / {Number(estimate.token1)} {nativeName}){' '}
        </StyledDescriptionText>
      </div>
      <div className={classes.button}>
        <ModalActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, lpName, val)
            }
          >
            {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
          </Button>
        </ModalActions>
      </div>
    </Modal>
  );
};

// const StyledActionSpacer = styled.div`
//   height: ${(props) => props.theme.spacing[4]}px;
//   width: ${(props) => props.theme.spacing[4]}px;
// `;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
