import React from 'react';

//Graveyard ecosystem logos
import polarLogo from '../../assets/img/polar-token.svg';
import spolarLogo from '../../assets/img/spolar-token.svg';
import pbondLogo from '../../assets/img/pbond-token.svg';

import lunarLogo from '../../assets/img/lunar-token.svg';
import aurisLogo from '../../assets/img/auris-token.png';
import lbondLogo from '../../assets/img/lbond-token.svg';
import abondLogo from '../../assets/img/abond-token.png';
import tripolarLogo from '../../assets/img/tripolar-token.svg';
import tribondLogo from '../../assets/img/tribond-token.svg';
import tripolarOldLogo from '../../assets/img/tripolar-token-old.svg';

import polarNearLpLogo from '../../assets/img/polar-aurora.svg';
import spolarNearLpLogo from '../../assets/img/spolar-aurora.svg';
import lunarLunaLpLogo from '../../assets/img/lunar-luna.svg';
import tripolarXtriLpLogo from '../../assets/img/tripolar-xtri.svg';

import auroraLogo from '../../assets/img/aurora_logo.svg';
import nearLogo from '../../assets/img/near_logo.svg';
import ustLogo from '../../assets/img/ust_logo.svg';
import lunaLogo from '../../assets/img/luna_logo.svg';
import usdcLogo from '../../assets/img/USDC.png';
import xtriLogo from '../../assets/img/xtri_logo.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  POLAR: polarLogo,
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
  TRIPOLAR: tripolarLogo,
  TRIBOND: tribondLogo,
  xTRI: xtriLogo,
  'TRIPOLAR-xTRI-LP': tripolarXtriLpLogo,
  TRIPOLAROLD: tripolarOldLogo
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
