import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, withStyles, makeStyles } from '@material-ui/core';
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
  tokenName?: string;
  decimals?: number;
}

const useStyles = makeStyles({
  root: {},
  container: {},
  selectToken: {
    display: 'flex',
    textAlign: 'center',
    fontSize: '20px',
  },
  inputToken: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'large',
    marginRight: '1em',
    verticalAlign: 'middle',
  },
  zapEstimates: {
    marginTop: '0.5em',
    textAlign: 'center',
    padding: '0.6em',
    fontSize: '30px',
  },
  button: {
    textAlign: 'center',
    margin: '-2em',
  },
});

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const polarisFinance = usePolarisFinance();
  const { balance } = useWallet();
  const ftmBalance = (Number(balance) / 1e24).toFixed(4).toString();
  const tombBalance = useTokenBalance(polarisFinance.POLAR);
  const tshareBalance = useTokenBalance(polarisFinance.SPOLAR);
  const [val, setVal] = useState('');
  const [zappingToken, setZappingToken] = useState(FTM_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(ftmBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be FTM in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const tombFtmLpStats = useLpStats('POLAR-NEAR-LP');
  const tShareFtmLpStats = useLpStats('SPOLAR-NEAR-LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(POLAR_TICKER) ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;
  const classes = useStyles();
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(ftmBalance);
    if (event.target.value === SPOLAR_TICKER) {
      setZappingTokenBalance(getDisplayBalance(tshareBalance, decimals));
    }
    if (event.target.value === POLAR_TICKER) {
      setZappingTokenBalance(getDisplayBalance(tombBalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const estimateZap = await polarisFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await polarisFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal>
      <Alert variant="filled" severity="warning" style={{ marginBottom: '1em' }}>
        Beta feature. Use at your own risk!
      </Alert>
      <ModalTitle text={`Zap in ${tokenName}`} />

      <StyledActionSpacer />
      <div className={classes.selectToken}>
        <InputLabel className={classes.selectToken} style={{ paddingTop: '20px' }} id="label">
          Select asset to zap with
        </InputLabel>
        <Select
          onChange={handleChangeAsset}
          style={{ color: 'white', width: '60%' }}
          labelId="label"
          id="select"
          value={zappingToken}
        >
          <StyledMenuItem value={FTM_TICKER}>FTM</StyledMenuItem>
          <StyledMenuItem value={SPOLAR_TICKER}>SPOLAR</StyledMenuItem>
          {/* Tomb as an input for zapping will be disabled due to issues occuring with the Gatekeeper system */}
          {/* <StyledMenuItem value={POLAR_TICKER}>POLAR</StyledMenuItem> */}
        </Select>
      </div>
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
          {tokenName}: {Number(estimate.token0) / Number(ftmAmountPerLP)}
        </StyledDescriptionText>
        <StyledDescriptionText>
          {' '}
          ({Number(estimate.token0)} {FTM_TICKER} / {Number(estimate.token1)}{' '}
          {tokenName.startsWith(POLAR_TICKER) ? POLAR_TICKER : SPOLAR_TICKER}){' '}
        </StyledDescriptionText>
      </div>
      <div className={classes.button}>
        <ModalActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, tokenName, val)
            }
          >
            {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
          </Button>
        </ModalActions>
      </div>

      <StyledActionSpacer />
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

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
