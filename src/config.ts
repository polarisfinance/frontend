// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@trisolaris/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.AURORA,
    networkName: 'Aurora Mainnet',
    ftmscanUrl: 'https://explorer.mainnet.aurora.dev/',
    defaultProvider: 'https://mainnet.aurora.dev',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      NEAR: ['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d', 24],
      USDC: ['0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6], // This is actually usdc on mainnet not fusdt
      AURORA: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18],
      UST: ['0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC', 18],
      LUNA: ['0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096', 18],
      'POLAR-NEAR-LP': ['0x60eaf44D2f7B942598875584d0EFe86029E2E4be', 18],
      'SPOLAR-NEAR-LP': ['0x82d442d50d74A993530d8907512dcA6CD40b4102', 18],
      'NEAR-USDC-LP': ['0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: ChainId.AURORA,
    networkName: 'Aurora Mainnet',
    ftmscanUrl: 'https://explorer.mainnet.aurora.dev/',
    defaultProvider: 'https://mainnet.aurora.dev',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      NEAR: ['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d', 24],
      USDC: ['0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6], // This is actually usdc on mainnet not fusdt
      AURORA: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18],
      UST: ['0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC', 18],
      LUNA: ['0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096', 18],
      'POLAR-NEAR-LP': ['0x60eaf44D2f7B942598875584d0EFe86029E2E4be', 18],
      'SPOLAR-NEAR-LP': ['0x82d442d50d74A993530d8907512dcA6CD40b4102', 18],
      'NEAR-USDC-LP': ['0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0', 18],
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
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  PolarAuroraRewardPool: {
    name: 'Earn POLAR by AURORA',
    poolId: 2,
    sectionInUI: 0,
    contract: 'PolarAuroraGenesisRewardPool',
    depositTokenName: 'AURORA',
    earnTokenName: 'POLAR',
    finished: false,
    sort: 1,
    closedForStaking: false,
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
    closedForStaking: false,
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
    closedForStaking: false,
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
    closedForStaking: false,
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
    sort: 6,
    closedForStaking: false,
  },
  SpolarNearLpSpolarRewardPool: {
    name: 'Earn SPOLAR by SPOLAR-NEAR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'SpolarNearLpSpolarRewardPool',
    depositTokenName: 'SPOLAR-NEAR-LP',
    earnTokenName: 'SPOLAR',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
};

export default configurations[process.env.NODE_ENV || 'production'];
