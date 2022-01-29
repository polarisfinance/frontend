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
    deployments: require('./tomb-finance/deployments/deployments.testing.json'),
    externalTokens: {
      AURORA: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18],
      USDC: ['0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6], // This is actually usdc on mainnet not fusdt
      ETH: ['0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', 18],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      ZOO: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      SHIBA: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      'ETH-USDC-LP': ['0x2f41af687164062f118297ca10751f4b55478ae1', 18],
      'TOMB-FTM-LP': ['0x905571987eB16fFd11Bf8F8272B82448Ab0f6397', 18],
      'TSHARE-FTM-LP': ['0x403fa4f5F1db29344E46e6fdD8d0006F9faDb11d', 18],
      'AURORA-ETH-LP': ['0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e', 18],
      WFTM: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18]
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
    deployments: require('./tomb-finance/deployments/deployments.testing.json'),
    externalTokens: {
      AURORA: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18],
      USDC: ['0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6], // This is actually usdc on mainnet not fusdt
      ETH: ['0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', 18],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      ZOO: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      SHIBA: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      'ETH-USDC-LP': ['0x2f41af687164062f118297ca10751f4b55478ae1', 18],
      'TOMB-FTM-LP': ['0x905571987eB16fFd11Bf8F8272B82448Ab0f6397', 18],
      'TSHARE-FTM-LP': ['0x403fa4f5F1db29344E46e6fdD8d0006F9faDb11d', 18],
      'AURORA-ETH-LP': ['0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e', 18],
      WFTM: ['0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18]
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
  TombFtmRewardPool: {
    name: 'Earn TOMB by FTM',
    poolId: 0,
    sectionInUI: 0,
    contract: 'TombFtmRewardPool',
    depositTokenName: 'WFTM',
    earnTokenName: 'TOMB',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  TombBooRewardPool: {
    name: 'Earn TOMB by BOO',
    poolId: 1,
    sectionInUI: 0,
    contract: 'TombBooGenesisRewardPool',
    depositTokenName: 'BOO',
    earnTokenName: 'TOMB',
    finished: false,
    sort: 2,
    closedForStaking: true,
  },
  TombShibaRewardPool: {
    name: 'Earn TOMB by SHIBA',
    poolId: 2,
    sectionInUI: 0,
    contract: 'TombShibaGenesisRewardPool',
    depositTokenName: 'SHIBA',
    earnTokenName: 'TOMB',
    finished: false,
    sort: 3,
    closedForStaking: true,
  },
  TombZooRewardPool: {
    name: 'Earn TOMB by ZOO',
    poolId: 3,
    sectionInUI: 0,
    contract: 'TombZooGenesisRewardPool',
    depositTokenName: 'ZOO',
    earnTokenName: 'TOMB',
    finished: false,
    sort: 4,
    closedForStaking: true,
  },
  TombFtmLPTombRewardPool: {
    name: 'Earn TOMB by TOMB-FTM LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'TombFtmLpTombRewardPool',
    depositTokenName: 'TOMB-FTM-LP',
    earnTokenName: 'TOMB',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  TombFtmLPTombRewardPoolOld: {
    name: 'Earn TOMB by TOMB-FTM LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'TombFtmLpTombRewardPoolOld',
    depositTokenName: 'TOMB-FTM-LP',
    earnTokenName: 'TOMB',
    finished: true,
    sort: 9,
    closedForStaking: true,
  },
  TombFtmLPTShareRewardPool: {
    name: 'Earn TSHARE by TOMB-FTM LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'TombFtmLPTShareRewardPool',
    depositTokenName: 'TOMB-FTM-LP',
    earnTokenName: 'TSHARE',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  TshareFtmLPTShareRewardPool: {
    name: 'Earn TSHARE by TSHARE-FTM LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'TshareFtmLPTShareRewardPool',
    depositTokenName: 'TSHARE-FTM-LP',
    earnTokenName: 'TSHARE',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
};

export default configurations[process.env.NODE_ENV || 'development'];
