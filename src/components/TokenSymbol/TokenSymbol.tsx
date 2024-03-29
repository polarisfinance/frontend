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

import polarNearLpLogo from '../../assets/img/polar-aurora.svg';
import spolarNearLpLogo from '../../assets/img/spolar-aurora.svg';
import lunarLunaLpLogo from '../../assets/img/lunar-luna.svg';
import tripolarXtriLpLogo from '../../assets/img/tripolar-xtri.svg';
import polarStnearLpLogo from '../../assets/img/polar-stnear.svg';

import auroraLogo from '../../assets/img/aurora_logo.svg';
import nearLogo from '../../assets/img/near_logo.svg';
import ustLogo from '../../assets/img/ust_logo.svg';
import lunaLogo from '../../assets/img/luna_logo.svg';
import usdcLogo from '../../assets/img/USDC.png';
import xtriLogo from '../../assets/img/xtri_logo.svg';
import polarLunarLogo from '../../assets/img/polar-lunar.svg';
import ethernalLogo from '../../assets/img/ethernal-token.svg';
import ebondLogo from '../../assets/img/ebond-token.svg';
import etherumLogo from '../../assets/img/ethereum-token.svg';
import ethernalEthLpLogo from '../../assets/img/ethernal-eth.svg';
import btcPegLogo from '../../assets/img/orbital-token.svg';
import btcBondLogo from '../../assets/img/obond-token.svg';
import wbtcLogo from '../../assets/img/wbtc-logo.svg';
import orbitalBtc from '../../assets/img/orbital-btc.svg';
import tripolarTri from '../../assets/img/tripolar-tri.svg';
import uspLogo from '../../assets/img/usp-logo.svg';
import uspBondLogo from '../../assets/img/uspbond-logo.svg';
import usnLogo from '../../assets/img/usn-logo.svg';
import usdtLogo from '../../assets/img/usdt-logo.svg';
import uspUsdcLogo from '../../assets/img/usp-usdc.svg';

import polarUsp from '../../assets/img/polar-usp.svg';
import ethernalUsp from '../../assets/img/ethernal-usp.svg';
import orbitalUsp from '../../assets/img/orbital-usp.svg';

import binarisLogo from '../../assets/img/binaris-token.svg';
import bbondLogo from '../../assets/img/bbond-token.svg';
import binarisBnb from '../../assets/img/binaris-bnb.svg';
import bnbLogo from '../../assets/img/bnb-logo.svg';
import binarisUsp from '../../assets/img/binaris-usp.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  POLAR: polarLogo,
  POLAR_METAMASK: polarLogo,
  SPOLAR: spolarLogo,
  PBOND: pbondLogo,
  PBOND_METAMASK: pbondLogo,
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
  OLDTRIPOLAR: tripolarLogo,
  'POLAR-STNEAR-LP': polarStnearLpLogo,
  'POLAR-LUNAR-LP': polarLunarLogo,
  ETHERNAL: ethernalLogo,
  EBOND: ebondLogo,
  WETH: etherumLogo,
  'ETHERNAL-ETH-LP': ethernalEthLpLogo,
  ORBITAL: btcPegLogo,
  OBOND: btcBondLogo,
  WBTC: wbtcLogo,
  'ORBITAL-BTC-LP': orbitalBtc,
  'TRIPOLAR-TRI-LP': tripolarTri,
  USP: uspLogo,
  USPBOND: uspBondLogo,
  USN: usnLogo,
  USDT: usdtLogo,
  'USP-USDC-LP': uspUsdcLogo,
  'POLAR-USP-LP': polarUsp,
  'ETHERNAL-USP-LP': ethernalUsp,
  'ORBITAL-USP-LP': orbitalUsp,

  BINARIS: binarisLogo,
  BBOND: bbondLogo,
  'BINARIS-BNB-LP': binarisBnb,
  BNB: bnbLogo,
  'BINARIS-USP-LP': binarisUsp,
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
