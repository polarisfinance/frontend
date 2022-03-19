import React from 'react';

//Graveyard ecosystem logos
import polarLogo from '../../assets/img/polar-token.svg';
import spolarLogo from '../../assets/img/spolar-token.svg';
import tombLogoPNG from '../../assets/img/crypto_tomb_cash.f2b44ef4.png';
import tShareLogoPNG from '../../assets/img/crypto_tomb_share.bf1a6c52.png';
import pbondLogo from '../../assets/img/pbond-token.svg';

import lunarLogo from '../../assets/img/lunar-token.png';
import aurisLogo from '../../assets/img/auris-token.png';
import lunarLunaLpLogo from '../../assets/img/lunar-luna.png';
import lbondLogo from '../../assets/img/lbond-token.png';
import abondLogo from '../../assets/img/abond-token.png';

import polarNearLpLogo from '../../assets/img/polar-aurora.svg';
import spolarNearLpLogo from '../../assets/img/spolar-aurora.svg';

import auroraLogo from '../../assets/img/aurora_logo.svg';
import nearLogo from '../../assets/img/near_logo.svg';
import ustLogo from '../../assets/img/ust_logo.svg';
import lunaLogo from '../../assets/img/luna_logo.svg';
import usdcLogo from '../../assets/img/USDC.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  POLAR: polarLogo,
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  SPOLAR: spolarLogo,
  PBOND: pbondLogo,
  AURORA: auroraLogo,
  NEAR: nearLogo,
  LUNA: lunaLogo,
  UST: ustLogo,
  USDC: usdcLogo,
  'POLAR-NEAR-LP': polarNearLpLogo,
  'SPOLAR-NEAR-LP': spolarNearLpLogo,
  LUNAR: lunarLogo,
  AURIS: aurisLogo,
  'LUNAR-LUNA-LP': lunarLunaLpLogo,
  LBOND: lbondLogo,
  ABOND: abondLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 95 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
