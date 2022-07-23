// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@trisolaris/sdk';
import { Configuration } from './polaris-finance/config';
import { BankInfo, SunriseInfo } from './polaris-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.AURORA,
    networkName: 'Aurora Mainnet',
    ftmscanUrl: 'https://aurorascan.dev/',
    defaultProvider: 'https://mainnet.aurora.dev/',
    defaultWssProvider: 'https://rpc.polarisfinance.io/',
    deployments: require('./polaris-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      NEAR: ['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d', 24],
      USDC: ['0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6], // This is actually usdc on mainnet not fusdt
      AURORA: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18],
      UST: ['0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC', 18],
      LUNA: ['0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096', 18],
      'POLAR-NEAR-LP': ['0x3fa4d0145a0b6Ad0584B1ad5f61cB490A04d8242', 18],
      'SPOLAR-NEAR-LP': ['0xADf9D0C77c70FCb1fDB868F54211288fCE9937DF', 18],
      'NEAR-USDC-LP': ['0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0', 18],
      'NEAR-TRI-LP': ['0x84b123875F0F36B966d0B6Ca14b31121bd9676AD', 18],
      POLAR: ['0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86', 18],
      PBOND: ['0x3a4773e600086A753862621A26a2E3274610da43', 18],
      'LUNAR-LUNA-LP': ['0x3e50da46cB79d1f9F08445984f207278796CE2d2', 18],
      LUNAR: ['0x25e801Eb75859Ba4052C4ac4233ceC0264eaDF8c', 18],
      LBOND: ['0x3a101bA3f4a39C921A171473592D4EBDA6bD0B57', 18],
      'LUNA-NEAR-LP': ['0xdf8cbf89ad9b7dafdd3e37acec539eecc8c47914', 18],
      SPOLAR: ['0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729', 18],
      STNEAR: ['0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30', 24],
      'POLAR-STNEAR-LP': ['0x75890912E9bb373dD0aA57a3fe9eC748Bf923915', 18],
      xTRI: ['0x802119e4e253D5C19aA06A5d567C5a41596D6803', 18],
      WBTC: ['0xF4eB217Ba2454613b15dBdea6e5f22276410e89e', 8],
      'BTC-NEAR-LP': ['0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb', 18],

      ORBITAL: ['0x3AC55eA8D2082fAbda674270cD2367dA96092889', 18],
      OBOND: ['0x192bdcdd7b95A97eC66dE5630a85967F6B79e695', 18],
      'ORBITAL-BTC-LP': ['0x7243cB5DBae5921c78A022110645a23a38ffBA5D', 18],

      TRIPOLAR: ['0x60527a2751A827ec0Adf861EfcAcbf111587d748', 18],
      TRIBOND: ['0x8200B4F47eDb608e36561495099a8caF3F806198', 18],
      'TRIPOLAR-xTRI-LP': ['0x85f155FDCf2a951fd95734eCEB99F875b84a2E27', 18],
      'STNEAR-xTRI-LP': ['0x5913f644a10d98c79f2e0b609988640187256373', 18],
      'STNEAR-NEAR-LP': ['0x47924ae4968832984f4091eec537dff5c38948a4', 18],
      'POLAR-LUNAR-LP': ['0x254320caDE0B3f44CA1c0C12D7aCeAd797D933e6', 18],
      WETH: ['0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', 18],
      'WETH-NEAR-LP': ['0x63da4DB6Ef4e7C62168aB03982399F9588fCd198', 18],
      ETHERNAL: ['0x17cbd9C274e90C537790C51b4015a65cD015497e', 18],
      EBOND: ['0x266437E6c7500A947012F19A3dE96a3881a0449E', 18],
      'ETHERNAL-ETH-LP': ['0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7', 18],
      TRI: ['0xFa94348467f64D5A457F75F8bc40495D33c65aBB', 18],
      'TRIPOLAR-TRI-LP': ['0x51488c4BcEEa96Ee530bC6093Bd0c00F9461fbb5', 18],

      USPBOND: ['0xcE32b28c19C61B19823395730A0c7d91C671E54b', 18],
      USP: ['0xa69d9Ba086D41425f35988613c156Db9a88a1A96', 18],
      'USP-USDC-LP': ['0xa984B8062316AFE25c86576b0478E76E65FdF564', 18],
      USN: ['0x5183e1B1091804BC2602586919E6880ac1cf2896', 18],
      USDT: ['0x4988a896b1227218e4A686fdE5EabdcAbd91571f', 6],
      'POLAR-USP-LP': ['0xc7193703dC70d0Ab3Ebc1a92cc013D70DC08e189', 18],
      'ETHERNAL-USP-LP': ['0x2BA1175563eb7FC165D640d3EAEe5D094e4af613', 18],
      'ORBITAL-USP-LP': ['0x711aB8ef67196Afd1dE0B35cBb81c775c12fA91F', 18],

      BINARIS: ['0xafE0d6ca6AAbB43CDA024895D203120831Ba0370', 18],
      BNB: ['0xb14674C7264eC7d948B904Aab2c0E0F906F6e762', 18],
      BBOND: ['0xfa32616447C51F056Db97BC1d0E2D4C0c4D059C9', 18],
      'BINARIS-BNB-LP': ['0x29A3e2Bb73891f20C6d4A34ecE0c4a6F8020ec32', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding POLAR
        - 2 = LP asset staking rewarding SPOLAR
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */

  // legacy
  PolarAuroraRewardPool: {
    name: 'Earn POLAR by AURORA',
    poolId: 2,
    sectionInUI: 0,
    contract: 'PolarAuroraGenesisRewardPool',
    depositTokenName: 'AURORA',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  PolarNearRewardPool: {
    name: 'Earn POLAR by NEAR',
    poolId: 3,
    sectionInUI: 0,
    contract: 'PolarNearGenesisRewardPool',
    depositTokenName: 'NEAR',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  PolarLunaRewardPool: {
    name: 'Earn POLAR by LUNA',
    poolId: 0,
    sectionInUI: 0,
    contract: 'PolarLunaGenesisRewardPool',
    depositTokenName: 'LUNA',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  PolarUSTRewardPool: {
    name: 'Earn POLAR by UST',
    poolId: 1,
    sectionInUI: 0,
    contract: 'PolarUstGenesisRewardPool',
    depositTokenName: 'UST',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  PolarUSDCRewardPool: {
    name: 'Earn POLAR by USDC',
    poolId: 4,
    sectionInUI: 0,
    contract: 'PolarUsdcGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  PolarNearLpPolarRewardPool: {
    name: 'Earn POLAR by POLAR-NEAR LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'PolarNearLpPolarRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  LunarLunaRewardPool: {
    name: 'Earn LUNAR by LUNA',
    poolId: 0,
    sectionInUI: 4,
    contract: 'LunarLunaGenesisRewardPool',
    depositTokenName: 'LUNA',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 0,
    closedForStaking: true,
  },
  LunarPolarNearRewardPool: {
    name: 'Earn LUNAR by POLAR/NEAR LP',
    poolId: 1,
    sectionInUI: 4,
    contract: 'LunarPolarNearGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  LunarSpolarNearRewardPool: {
    name: 'Earn LUNAR by SPOLAR/NEAR LP',
    poolId: 2,
    sectionInUI: 4,
    contract: 'LunarSpolarNearGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  LunarSpolarRewardPool: {
    name: 'Earn LUNAR by SPOLAR',
    poolId: 3,
    sectionInUI: 4,
    contract: 'LunarSpolarGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  LunarPolarRewardPool: {
    name: 'Earn LUNAR by POLAR',
    poolId: 4,
    sectionInUI: 4,
    contract: 'LunarPolarGenesisRewardPool',
    depositTokenName: 'POLAR',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  LunarPbondRewardPool: {
    name: 'Earn LUNAR by PBOND',
    poolId: 5,
    sectionInUI: 4,
    contract: 'LunarPbondGenesisRewardPool',
    depositTokenName: 'PBOND',
    earnTokenName: 'LUNAR',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  TripolarXtriRewardPool: {
    name: 'Earn TRIPOLAR by xTRI',
    poolId: 0,
    sectionInUI: 3,
    contract: 'TripolarXtriGenesisRewardPool',
    depositTokenName: 'xTRI',
    earnTokenName: 'TRIPOLAR',
    finished: false,
    sort: 0,
    closedForStaking: true,
  },
  TripolarPolarNearRewardPool: {
    name: 'Earn TRIPOLAR by POLAR/NEAR LP',
    poolId: 1,
    sectionInUI: 3,
    contract: 'TripolarPolarNearGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'TRIPOLAR',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  TripolarSpolarNearRewardPool: {
    name: 'Earn TRIPOLAR by SPOLAR/NEAR LP',
    poolId: 2,
    sectionInUI: 3,
    contract: 'TripolarSpolarNearGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'TRIPOLAR',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  TripolarLunarLunaRewardPool: {
    name: 'Earn TRIPOLAR by LUNAR/LUNA LP',
    poolId: 3,
    sectionInUI: 3,
    contract: 'TripolarLunarLunaGenesisRewardPool',
    depositTokenName: 'LUNAR-LUNA-LP',
    earnTokenName: 'TRIPOLAR',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  TripolarSpolarRewardPool: {
    name: 'Earn TRIPOLAR by SPOLAR',
    poolId: 4,
    sectionInUI: 3,
    contract: 'TripolarSpolarGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'TRIPOLAR',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  EthernalEthGenesisRewardPool: {
    name: 'Earn ETHERNAL by WETH',
    poolId: 0,
    sectionInUI: 6,
    contract: 'EthernalEthGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 0,
    closedForStaking: true,
  },
  EthernalSpolarGenesisRewardPool: {
    name: 'Earn ETHERNAL by SPOLAR',
    poolId: 1,
    sectionInUI: 6,
    contract: 'EthernalSpolarGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  EthernalSpolarNearGenesisRewardPool: {
    name: 'Earn ETHERNAL by SPOLAR/NEAR LP',
    poolId: 2,
    sectionInUI: 6,
    contract: 'EthernalSpolarNearGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  EthernalPolarNearGenesisRewardPool: {
    name: 'Earn ETHERNAL by POLAR/NEAR LP',
    poolId: 3,
    sectionInUI: 6,
    contract: 'EthernalPolarNearGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  EthernalPolarStnearGenesisRewardPool: {
    name: 'Earn ETHERNAL by POLAR/STNEAR LP',
    poolId: 4,
    sectionInUI: 6,
    contract: 'EthernalPolarStnearGenesisRewardPool',
    depositTokenName: 'POLAR-STNEAR-LP',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  EthernalTripolarXtriGenesisRewardPool: {
    name: 'Earn ETHERNAL by TRIPOLAR/xTRI LP',
    poolId: 5,
    sectionInUI: 6,
    contract: 'EthernalTripolarXtriGenesisRewardPool',
    depositTokenName: 'TRIPOLAR-xTRI-LP',
    earnTokenName: 'ETHERNAL',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  OrbitalWbtcGenesisRewardPool: {
    name: 'Earn ORBITAL by WBTC',
    poolId: 0,
    sectionInUI: 7,
    contract: 'OrbitalBtcGenesisRewardPool',
    depositTokenName: 'WBTC',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 0,
    closedForStaking: true,
  },
  OrbitalSpolarGenesisRewardPool: {
    name: 'Earn ORBITAL by SPOLAR',
    poolId: 1,
    sectionInUI: 7,
    contract: 'OrbitalSpolarGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  OrbitalSpolarNearLPGenesisRewardPool: {
    name: 'Earn ORBITAL by SPOLAR/NEAR LP',
    poolId: 2,
    sectionInUI: 7,
    contract: 'OrbitalSpolarNearLPGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  OrbitalPolarNearLPGenesisRewardPool: {
    name: 'Earn ORBITAL by POLAR/NEAR LP',
    poolId: 3,
    sectionInUI: 7,
    contract: 'OrbitalPolarNearLPGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  OrbitalPolarStnearLPGenesisRewardPool: {
    name: 'Earn ORBITAL by POLAR/STNEAR LP',
    poolId: 4,
    sectionInUI: 7,
    contract: 'OrbitalPolarStnearLPGenesisRewardPool',
    depositTokenName: 'POLAR-STNEAR-LP',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  OrbitalTripolarXtriLPGenesisRewardPool: {
    name: 'Earn ORBITAL by TRIPOLAR/xTRI LP',
    poolId: 5,
    sectionInUI: 7,
    contract: 'OrbitalTripolarXtriLPGenesisRewardPool',
    depositTokenName: 'TRIPOLAR-xTRI-LP',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 6,
    closedForStaking: true,
  },
  OrbitalEthernalEthLPGenesisRewardPool: {
    name: 'Earn ORBITAL by ETHERNAL/ETH LP',
    poolId: 6,
    sectionInUI: 7,
    contract: 'OrbitalEthernalEthLPGenesisRewardPool',
    depositTokenName: 'ETHERNAL-ETH-LP',
    earnTokenName: 'ORBITAL',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },

  UspUsdcGenesisRewardPool: {
    name: 'Earn USP by USDC',
    poolId: 0,
    sectionInUI: 8,
    contract: 'UspUsdcGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'USP',
    finished: false,
    sort: 0,
    closedForStaking: true,
  },
  UspUsdtGenesisRewardPool: {
    name: 'Earn USP by USDT',
    poolId: 1,
    sectionInUI: 8,
    contract: 'UspUsdtGenesisRewardPool',
    depositTokenName: 'USDT',
    earnTokenName: 'USP',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  UspUsnGenesisRewardPool: {
    name: 'Earn USP by USN',
    poolId: 2,
    sectionInUI: 8,
    contract: 'UspUsnGenesisRewardPool',
    depositTokenName: 'USN',
    earnTokenName: 'USP',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  UspSpolarGenesisRewardPool: {
    name: 'Earn USP by SPOLAR',
    poolId: 3,
    sectionInUI: 8,
    contract: 'UspSpolarGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'USP',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  UspSpolarNearLPGenesisRewardPool: {
    name: 'Earn USP by SPOLAR/NEAR LP',
    poolId: 4,
    sectionInUI: 8,
    contract: 'UspSpolarNearLPGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  UspPolarNearLPGenesisRewardPool: {
    name: 'Earn USP by POLAR/NEAR LP',
    poolId: 5,
    sectionInUI: 8,
    contract: 'UspPolarNearLPGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  UspPolarStnearLPGenesisRewardPool: {
    name: 'Earn USP by POLAR/STNEAR LP',
    poolId: 6,
    sectionInUI: 8,
    contract: 'UspPolarStnearLPGenesisRewardPool',
    depositTokenName: 'POLAR-STNEAR-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 6,
    closedForStaking: true,
  },
  UspEthernalEthLPGenesisRewardPool: {
    name: 'Earn USP by ETHERNAL/ETH LP',
    poolId: 7,
    sectionInUI: 8,
    contract: 'UspEthernalEthLPGenesisRewardPool',
    depositTokenName: 'ETHERNAL-ETH-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 7,
    closedForStaking: true,
  },
  UspOrbitalWbtcLPGenesisRewardPool: {
    name: 'Earn USP by ORBITAL/BTC LP',
    poolId: 8,
    sectionInUI: 8,
    contract: 'UspOrbitalWbtcLPGenesisRewardPool',
    depositTokenName: 'ORBITAL-BTC-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 8,
    closedForStaking: true,
  },
  UspTripolarTriLPGenesisRewardPool: {
    name: 'Earn USP by TRIPOLAR/TRI LP',
    poolId: 9,
    sectionInUI: 8,
    contract: 'UspTripolarTriLPGenesisRewardPool',
    depositTokenName: 'TRIPOLAR-TRI-LP',
    earnTokenName: 'USP',
    finished: false,
    sort: 9,
    closedForStaking: true,
  },

  TripolarXtriSpolarRewardPool: {
    name: 'Earn SPOLAR by TRIPOLAR/xTRI LP',
    poolId: 6,
    sectionInUI: 3,
    contract: 'TripolarXtriLPSpolarRewardPool',
    depositTokenName: 'TRIPOLAR-xTRI-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 20,
    closedForStaking: true,
  },
  TripolarTriSpolarRewardPool: {
    name: 'Earn SPOLAR by TRIPOLAR/TRI LP',
    poolId: 10,
    sectionInUI: 2,
    contract: 'TripolarTriLPSpolarRewardPool',
    depositTokenName: 'TRIPOLAR-TRI-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  LunarLunaSpolarRewardPool: {
    name: 'Earn SPOLAR by LUNAR/LUNA LP',
    poolId: 4,
    sectionInUI: 5,
    contract: 'LunarLunaLPSpolarRewardPool',
    depositTokenName: 'LUNAR-LUNA-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  PolarNearLpSpolarRewardPool: {
    name: 'Earn SPOLAR by POLAR-NEAR LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'PolarNearLpSpolarRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  PolarStNearLpSpolarRewardPool: {
    name: 'Earn SPOLAR by POLAR-STNEAR LP',
    poolId: 5,
    sectionInUI: 2,
    contract: 'PolarStNearLpSpolarRewardPool',
    depositTokenName: 'POLAR-STNEAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  PolarLunarLpSpolarRewardPool: {
    name: 'Earn SPOLAR by POLAR-LUNAR LP',
    poolId: 7,
    sectionInUI: 5,
    contract: 'PolarLunarLpSpolarRewardPool',
    depositTokenName: 'POLAR-LUNAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  SpolarNearLpSpolarRewardPool: {
    name: 'Earn SPOLAR by SPOLAR-NEAR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'SpolarNearLpSpolarRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 0,
    closedForStaking: false,
  },
  PolarSpolarRewardPool: {
    name: 'Earn SPOLAR by POLAR',
    poolId: 2,
    sectionInUI: 2,
    contract: 'PolarSpolarRewardPool',
    depositTokenName: 'POLAR',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 15,
    closedForStaking: false,
  },
  EthernalEthLpSpolarRewardPool: {
    name: 'Earn SPOLAR by ETHERNAL-ETH LP',
    poolId: 8,
    sectionInUI: 2,
    contract: 'EthernalEthLPSpolarRewardPool',
    depositTokenName: 'ETHERNAL-ETH-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  OrbitalBtcLPSpolarRewardPool: {
    name: 'Earn SPOLAR by ORBITAL-WBTC LP',
    poolId: 9,
    sectionInUI: 2,
    contract: 'OrbitalBtcLPSpolarRewardPool',
    depositTokenName: 'ORBITAL-BTC-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  OrbitalSpolarRewardPool: {
    name: 'Earn SPOLAR by ORBITAL',
    poolId: 12,
    sectionInUI: 2,
    contract: 'OrbitalSpolarRewardPool',
    depositTokenName: 'ORBITAL',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 17,
    closedForStaking: false,
  },
  EthernalSpolarRewardPool: {
    name: 'Earn SPOLAR by ETHERNAL',
    poolId: 11,
    sectionInUI: 2,
    contract: 'EthernalSpolarRewardPool',
    depositTokenName: 'ETHERNAL',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 16,
    closedForStaking: false,
  },
  UspUsdcLPSpolarRewardPool: {
    name: 'Earn SPOLAR by USP-USDC LP',
    poolId: 13,
    sectionInUI: 2,
    contract: 'UspSpolarRewardPool',
    depositTokenName: 'USP-USDC-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 5,
    closedForStaking: false,
  },
  PolarUspLPSpolarRewardPool: {
    name: 'Earn SPOLAR by POLAR-USP LP',
    poolId: 14,
    sectionInUI: 2,
    contract: 'PolarUspLpSpolarRewardPool',
    depositTokenName: 'POLAR-USP-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
  EthernalUspLPSpolarRewardPool: {
    name: 'Earn SPOLAR by ETHERNAL-USP LP',
    poolId: 15,
    sectionInUI: 2,
    contract: 'EthernalUspLpSpolarRewardPool',
    depositTokenName: 'ETHERNAL-USP-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 8,
    closedForStaking: false,
  },
  OrbitalUspLPSpolarRewardPool: {
    name: 'Earn SPOLAR by ORBITAL-USP LP',
    poolId: 16,
    sectionInUI: 2,
    contract: 'OrbitalUspLpSpolarRewardPool',
    depositTokenName: 'ORBITAL-USP-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 9,
    closedForStaking: false,
  },
  PbondSpolarRewardPool: {
    name: 'Earn SPOLAR by PBOND',
    poolId: 3,
    sectionInUI: 2,
    contract: 'PbondSpolarRewardPool',
    depositTokenName: 'PBOND',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  EbondSpolarRewardPool: {
    name: 'Earn SPOLAR by EBOND',
    poolId: 19,
    sectionInUI: 2,
    contract: 'EbondSpolarRewardPool',
    depositTokenName: 'EBOND',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 11,
    closedForStaking: false,
  },
  ObondSpolarRewardPool: {
    name: 'Earn SPOLAR by OBOND',
    poolId: 17,
    sectionInUI: 2,
    contract: 'ObondSpolarRewardPool',
    depositTokenName: 'OBOND',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 12,
    closedForStaking: false,
  },
  UspbondSpolarRewardPool: {
    name: 'Earn SPOLAR by USPBOND',
    poolId: 18,
    sectionInUI: 9,
    contract: 'UspbondSpolarRewardPool',
    depositTokenName: 'USPBOND',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 13,
    closedForStaking: true,
  },
  BnbBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by BNB',
    poolId: 0,
    sectionInUI: 10,
    contract: 'BnbBinarisGenesisRewardPool',
    depositTokenName: 'BNB',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  SpolarBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by SPOLAR',
    poolId: 1,
    sectionInUI: 10,
    contract: 'SpolarBinarisGenesisRewardPool',
    depositTokenName: 'SPOLAR',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  PolarBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by POLAR',
    poolId: 2,
    sectionInUI: 10,
    contract: 'PolarBinarisGenesisRewardPool',
    depositTokenName: 'POLAR',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  EthernalBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by ETHERNAL',
    poolId: 3,
    sectionInUI: 10,
    contract: 'EthernalBinarisGenesisRewardPool',
    depositTokenName: 'ETHERNAL',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  OrbitalBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by ORBITAL',
    poolId: 4,
    sectionInUI: 10,
    contract: 'OrbitalBinarisGenesisRewardPool',
    depositTokenName: 'ORBITAL',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 5,
    closedForStaking: false,
  },
  UspBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by USP',
    poolId: 5,
    sectionInUI: 10,
    contract: 'UspBinarisGenesisRewardPool',
    depositTokenName: 'USP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  PbondBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by PBOND',
    poolId: 6,
    sectionInUI: 10,
    contract: 'PbondBinarisGenesisRewardPool',
    depositTokenName: 'PBOND',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
  EbondBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by EBOND',
    poolId: 7,
    sectionInUI: 10,
    contract: 'EbondBinarisGenesisRewardPool',
    depositTokenName: 'EBOND',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 8,
    closedForStaking: false,
  },
  ObondBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by OBOND',
    poolId: 8,
    sectionInUI: 10,
    contract: 'ObondBinarisGenesisRewardPool',
    depositTokenName: 'OBOND',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 9,
    closedForStaking: false,
  },
  PolarNearLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by POLAR-NEAR-LP',
    poolId: 9,
    sectionInUI: 10,
    contract: 'PolarNearLPBinarisGenesisRewardPool',
    depositTokenName: 'POLAR-NEAR-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  SpolarNearLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by SPOLAR-NEAR-LP',
    poolId: 10,
    sectionInUI: 10,
    contract: 'SpolarNearLPBinarisGenesisRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 11,
    closedForStaking: false,
  },
  PolarStnearLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by POLAR-STNEAR-LP',
    poolId: 11,
    sectionInUI: 10,
    contract: 'PolarStnearLPBinarisGenesisRewardPool',
    depositTokenName: 'POLAR-STNEAR-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 12,
    closedForStaking: false,
  },
  EthernalEthLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by ETHERNAL-ETH-LP',
    poolId: 12,
    sectionInUI: 10,
    contract: 'EthernalEthLPBinarisGenesisRewardPool',
    depositTokenName: 'ETHERNAL-ETH-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 13,
    closedForStaking: false,
  },
  OrbitalWbtcLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by ORBITAL-BTC-LP',
    poolId: 13,
    sectionInUI: 10,
    contract: 'OrbitalBtcLPBinarisGenesisRewardPool',
    depositTokenName: 'ORBITAL-BTC-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 14,
    closedForStaking: false,
  },
  UspUsdcLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by USP-USDC-LP',
    poolId: 14,
    sectionInUI: 10,
    contract: 'UspUsdcLPBinarisGenesisRewardPool',
    depositTokenName: 'USP-USDC-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 15,
    closedForStaking: false,
  },
  TripolarTriLPBinarisGenesisRewardPool: {
    name: 'Earn BINARIS by TRIPOLAR-TRI-LP',
    poolId: 15,
    sectionInUI: 10,
    contract: 'TripolarTriLPBinarisGenesisRewardPool',
    depositTokenName: 'TRIPOLAR-TRI-LP',
    earnTokenName: 'BINARIS',
    finished: false,
    sort: 16,
    closedForStaking: false,
  },
};

export const sunriseDefinitions: { [contractName: string]: SunriseInfo } = {
  PolarSunrise: {
    name: 'polar',
    contract: 'Masonry',
    earnTokenName: 'POLAR',
    sort: 3,
    boosted: false,
    coming: false,
    retired: false,
    bond: 'PBOND',
    tokenAddress: '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86',
    lpAddress: '0x3fa4d0145a0b6Ad0584B1ad5f61cB490A04d8242',
    treasury: 'Treasury',
    lpToken: 'NEAR',
    getTokenPreviousEpochTWAP: 'previousEpochpolarPrice',
    getTokenPriceInLastTWAP: 'getpolarUpdatedPrice',
    getBondsPurchasable: 'getBurnablepolarLeft',
    getPrice: 'getpolarPrice',
    oracle: 'SeigniorageOracle',
  },
  LunarSunrise: {
    name: 'lunar',
    contract: 'lunarSunrise',
    earnTokenName: 'LUNAR',
    sort: 4,
    boosted: false,
    coming: false,
    retired: true,
    bond: 'LBOND',
    tokenAddress: '0x25e801Eb75859Ba4052C4ac4233ceC0264eaDF8c',
    lpAddress: '0x3e50da46cB79d1f9F08445984f207278796CE2d2',
    treasury: 'lunarTreasury',
    lpToken: 'LUNA',
    retireMsg: 'Please withdraw your SPOLAR and migrate them to other active Sunrises.',
    getTokenPreviousEpochTWAP: 'previousEpochlunarPrice',
    getTokenPriceInLastTWAP: 'getlunarUpdatedPrice',
    getBondsPurchasable: 'getBurnablelunarLeft',
    getPrice: 'getlunarPrice',
    oracle: 'LunarOracle',
  },
  TripolarSunrise: {
    name: 'tripolar',
    contract: 'tripolarSunrise',
    earnTokenName: 'TRIPOLAR',
    sort: 4,
    boosted: false,
    coming: false,
    retired: false,
    bond: 'TRIBOND',
    tokenAddress: '0x60527a2751A827ec0Adf861EfcAcbf111587d748',
    lpAddress: '0x51488c4BcEEa96Ee530bC6093Bd0c00F9461fbb5',
    treasury: 'tripolarTreasury',
    lpToken: 'TRI',
    getTokenPreviousEpochTWAP: 'previousEpochTripolarPrice',
    getTokenPriceInLastTWAP: 'getTripolarUpdatedPrice',
    getBondsPurchasable: 'getBurnableTripolarLeft',
    getPrice: 'getTripolarPrice',
    oracle: 'TripolarOracle',
  },
  OldTripolarSunrise: {
    name: 'tripolarOld',
    contract: 'tripolarSunriseOld',
    earnTokenName: 'OLDTRIPOLAR',
    sort: 2,
    boosted: false,
    coming: false,
    retired: true,
    bond: 'TRIBOND',
    tokenAddress: '0x60527a2751A827ec0Adf861EfcAcbf111587d748',
    lpAddress: '0x85f155FDCf2a951fd95734eCEB99F875b84a2E27',
    treasury: 'tripolarTreasuryOld',
    lpToken: 'xTRI',
    retireMsg: 'Please withdraw your SPOLAR and migrate them to the NEW TRIPOLAR Sunrise.',
    getTokenPreviousEpochTWAP: 'previousEpochTripolarPrice',
    getTokenPriceInLastTWAP: 'getTripolarUpdatedPrice',
    getBondsPurchasable: 'getBurnableTripolarLeft',
    getPrice: 'getTripolarPrice',
    oracle: 'TripolarOracle',
  },
  EthernalSunrise: {
    name: 'ethernal',
    contract: 'ethernalSunrise',
    earnTokenName: 'ETHERNAL',
    sort: 2,
    boosted: false,
    coming: false,
    retired: false,
    bond: 'EBOND',
    tokenAddress: '0x17cbd9C274e90C537790C51b4015a65cD015497e',
    lpAddress: '0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7',
    treasury: 'ethernalTreasury',
    lpToken: 'WETH',
    getTokenPreviousEpochTWAP: 'previousEpochEthernalPrice',
    getTokenPriceInLastTWAP: 'getEthernalUpdatedPrice',
    getBondsPurchasable: 'getBurnableEthernalLeft',
    getPrice: 'getEthernalPrice',
    oracle: 'EthernalOracle',
  },
  BtcSunrise: {
    name: 'orbital',
    contract: 'orbitalSunrise',
    earnTokenName: 'ORBITAL',
    sort: 1,
    boosted: false,
    coming: false,
    retired: false,
    notActive: false,
    bond: 'OBOND',
    tokenAddress: '0x3AC55eA8D2082fAbda674270cD2367dA96092889',
    lpAddress: '0x7243cB5DBae5921c78A022110645a23a38ffBA5D',
    treasury: 'orbitalTreasury',
    lpToken: 'WBTC',
    getTokenPreviousEpochTWAP: 'previousEpochOrbitalPrice',
    getTokenPriceInLastTWAP: 'getOrbitalUpdatedPrice',
    getBondsPurchasable: 'getBurnableOrbitalLeft',
    getPrice: 'getOrbitalPrice',
    oracle: 'OrbitalOracle',
  },
  UspSunrise: {
    name: 'usp',
    contract: 'uspSunrise',
    earnTokenName: 'USP',
    sort: 0,
    boosted: false,
    coming: false,
    retired: false,
    notActive: false,
    bond: 'USPBOND',
    tokenAddress: '0xa69d9Ba086D41425f35988613c156Db9a88a1A96',
    lpAddress: '0xa984B8062316AFE25c86576b0478E76E65FdF564',
    treasury: 'uspTreasury',
    lpToken: 'USDC',
    getTokenPreviousEpochTWAP: 'previousEpochUspPrice',
    getTokenPriceInLastTWAP: 'getUspUpdatedPrice',
    getBondsPurchasable: 'getBurnableUspLeft',
    getPrice: 'getUspPrice',
    oracle: 'UspOracle',
  },
  BinarisSunrise: {
    name: 'binaris',
    contract: 'binarisSunrise',
    earnTokenName: 'BINARIS',
    sort: 5,
    boosted: false,
    coming: false,
    retired: false,
    notActive: false,
    bond: 'BBOND',
    tokenAddress: '0xafE0d6ca6AAbB43CDA024895D203120831Ba0370',
    lpAddress: '0x29A3e2Bb73891f20C6d4A34ecE0c4a6F8020ec32',
    treasury: 'binarisTreasury',
    lpToken: 'BNB',
    getTokenPreviousEpochTWAP: 'previousEpochBinarisPrice',
    getTokenPriceInLastTWAP: 'getBinarisUpdatedPrice',
    getBondsPurchasable: 'getBurnableBinarisLeft',
    getPrice: 'getBinarisPrice',
    oracle: 'BinarisOracle',
  },
  AurisSunrise: {
    name: 'tripolar',
    contract: 'tripolarSunrise',
    earnTokenName: 'AURIS',
    sort: 6,
    boosted: false,
    coming: true,
    retired: false,
    bond: 'ABOND',
    tokenAddress: '',
    lpAddress: '',
    treasury: 'tripolarTreasury',
    lpToken: 'AURORA',
    getTokenPreviousEpochTWAP: 'previousEpochTripolarPrice',
    getTokenPriceInLastTWAP: 'getTripolarUpdatedPrice',
    getBondsPurchasable: 'getBurnableTripolarLeft',
    getPrice: 'getTripolarPrice',
    oracle: 'TripolarOracle',
  },
};

export default configurations['production'];
