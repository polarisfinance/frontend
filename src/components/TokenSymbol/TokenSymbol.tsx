import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/polar-token.svg';
import tShareLogo from '../../assets/img/spolar-token.svg';
import tombLogoPNG from '../../assets/img/crypto_tomb_cash.f2b44ef4.png';
import tShareLogoPNG from '../../assets/img/crypto_tomb_share.bf1a6c52.png';
import tBondLogo from '../../assets/img/pbond-token.svg';

import polarNearLpLogo from '../../assets/img/polar-aurora.svg';
import spolarNearLpLogo from '../../assets/img/spolar-aurora.svg';

import auroraLogo from '../../assets/img/aurora_logo.svg';
import nearLogo from '../../assets/img/near_logo.svg';
import ustLogo from '../../assets/img/ust_logo.svg';
import lunaLogo from '../../assets/img/luna_logo.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  TSHARE: tShareLogo,
  TBOND: tBondLogo,
  AURORA: auroraLogo,
  NEAR: nearLogo,
  LUNA: lunaLogo,
  UST: ustLogo,
  'POLAR-NEAR-LP': polarNearLpLogo,
  'SPOLAR-NEAR-LP': spolarNearLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
