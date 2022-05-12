// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@trisolaris/sdk';
import { Configuration } from './polaris-finance/config';
import { BankInfo, SunriseInfo } from './polaris-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.AURORA,
    networkName: 'Aurora Mainnet',
    ftmscanUrl: 'https://aurorascan.dev/',
    defaultProvider: 'https://mainnet.aurora.dev',
    defaultWssProvider: 'wss://mainnet.aurora.dev',
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

      TRIPOLAR: ['0x60527a2751A827ec0Adf861EfcAcbf111587d748', 18],
      TRIBOND: ['0x8200B4F47eDb608e36561495099a8caF3F806198', 18],
      'TRIPOLAR-xTRI-LP': ['0x85f155FDCf2a951fd95734eCEB99F875b84a2E27', 18],
      'STNEAR-xTRI-LP': ['0x5913f644a10d98c79f2e0b609988640187256373', 18],
      'STNEAR-NEAR-LP': ['0x47924ae4968832984f4091eec537dff5c38948a4', 18],
      'POLAR-LUNAR-LP': ['0x254320caDE0B3f44CA1c0C12D7aCeAd797D933e6', 18],
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
  TripolarXtriSpolarRewardPool: {
    name: 'Earn SPOLAR by TRIPOLAR/xTRI LP',
    poolId: 6,
    sectionInUI: 2,
    contract: 'TripolarXtriLPSpolarRewardPool',
    depositTokenName: 'TRIPOLAR-xTRI-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  LunarLunaSpolarRewardPool: {
    name: 'Earn SPOLAR by LUNAR/LUNA LP',
    poolId: 4,
    sectionInUI: 2,
    contract: 'LunarLunaLPSpolarRewardPool',
    depositTokenName: 'LUNAR-LUNA-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 3,
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
    sectionInUI: 2,
    contract: 'PolarLunarLpSpolarRewardPool',
    depositTokenName: 'POLAR-LUNAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 7,
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
    sectionInUI: 5,
    contract: 'PolarSpolarRewardPool',
    depositTokenName: 'POLAR',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  PbondSpolarRewardPool: {
    name: 'Earn SPOLAR by PBOND',
    poolId: 3,
    sectionInUI: 5,
    contract: 'PbondSpolarRewardPool',
    depositTokenName: 'PBOND',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
};

export const sunriseDefinitions: { [contractName: string]: SunriseInfo } = {
  PolarSunrise: {
    name: 'polar',
    contract: 'Masonry',
    earnTokenName: 'POLAR',
    sort: 0,
    boosted: true,
    coming: false,
    retired: false,
    bond: 'PBOND',
    tokenAddress: '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86',
    lpAddress: '0x3fa4d0145a0b6Ad0584B1ad5f61cB490A04d8242',
  },
  LunarSunrise: {
    name: 'lunar',
    contract: 'lunarSunrise',
    earnTokenName: 'LUNAR',
    sort: 1,
    boosted: true,
    coming: false,
    retired: false,
    bond: 'LBOND',
    tokenAddress: '0x25e801Eb75859Ba4052C4ac4233ceC0264eaDF8c',
    lpAddress: '0x3e50da46cB79d1f9F08445984f207278796CE2d2',
  },
  TripolarSunrise: {
    name: 'tripolar',
    contract: 'tripolarSunrise',
    earnTokenName: 'TRIPOLAR',
    sort: 2,
    boosted: false,
    coming: false,
    retired: false,
    bond: 'TRIBOND',
    tokenAddress: '0x60527a2751A827ec0Adf861EfcAcbf111587d748',
    lpAddress: '0x85f155FDCf2a951fd95734eCEB99F875b84a2E27',
  },
  EthernalSunrise: {
    name: 'tripolar',
    contract: 'tripolarSunrise',
    earnTokenName: 'ETHERNAL',
    sort: 3,
    boosted: false,
    coming: true,
    retired: false,
    bond: 'EBOND',
    tokenAddress: '',
    lpAddress: '',
  },
  AurisSunrise: {
    name: 'tripolar',
    contract: 'tripolarSunrise',
    earnTokenName: 'AURIS',
    sort: 4,
    boosted: false,
    coming: true,
    retired: false,
    bond: 'ABOND',
    tokenAddress: '',
    lpAddress: '',
  },
};

export default configurations['production'];
