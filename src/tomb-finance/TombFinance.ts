// import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Fetcher, Route, Token } from '@trisolaris/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, TShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER } from '../utils/constants';
/**
 * An API module of Tomb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TombFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  masonryVersionOfUser?: string;

  TOMBWFTM_LP: Contract;
  TOMB: ERC20;
  TSHARE: ERC20;
  TBOND: ERC20;
  FTM: ERC20;

  LUNAR: ERC20;
  LBOND: ERC20;

  TRIPOLAR: ERC20;
  TRIBOND: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.TOMB = new ERC20(deployments.polar.address, provider, 'POLAR');
    this.TSHARE = new ERC20(deployments.tShare.address, provider, 'SPOLAR');
    this.TBOND = new ERC20(deployments.tBond.address, provider, 'PBOND');
    this.FTM = this.externalTokens['NEAR'];

    this.LUNAR = new ERC20(deployments.lunar.address, provider, 'LUNAR');
    this.LBOND = new ERC20(deployments.lBond.address, provider, 'LBOND');

    this.TRIPOLAR = new ERC20(deployments.tripolar.address, provider, 'TRIPOLAR');
    this.TRIBOND = new ERC20(deployments.triBond.address, provider, 'TRIBOND');
    // Uniswap V2 Pair
    this.TOMBWFTM_LP = new Contract(externalTokens['POLAR-NEAR-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [
      this.TOMB,
      this.TSHARE,
      this.TBOND,
      this.LUNAR,
      this.LBOND,
      this.TRIPOLAR,
      this.TRIBOND,
      ...Object.values(this.externalTokens),
    ];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.TOMBWFTM_LP = this.TOMBWFTM_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch masonry version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getTombStat(): Promise<TokenStat> {
    const { PolarAuroraGenesisRewardPool, PolarNearLpPolarRewardPool } = this.contracts;
    const [supply, tombRewardPoolSupply, tombRewardPoolSupply2, priceInFTM, priceOfOneFTM] = await Promise.all([
      this.TOMB.totalSupply(),
      this.TOMB.balanceOf(PolarAuroraGenesisRewardPool.address),
      this.TOMB.balanceOf(PolarNearLpPolarRewardPool.address),
      this.getTokenPriceFromPancakeswap(this.TOMB),
      this.getWFTMPriceFromPancakeswap(),
    ]);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply).sub(tombRewardPoolSupply2);
    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getLunarStat(): Promise<TokenStat> {
    const { LunarLunaGenesisRewardPool } = this.contracts;
    const [supply, LunarLunaGenesisRewardPoolSupply, priceInLUNA, priceOfOneLUNA] = await Promise.all([
      this.LUNAR.totalSupply(),
      this.LUNAR.balanceOf(LunarLunaGenesisRewardPool.address),
      this.getTokenPriceLunar(this.LUNAR),
      this.getLUNAPrice(),
    ]);
    const LunarCirculatingSupply = supply.sub(LunarLunaGenesisRewardPoolSupply);
    const priceOfLUNARInDollars = (Number(priceInLUNA) * Number(priceOfOneLUNA)).toFixed(2);

    return {
      tokenInFtm: priceInLUNA,
      priceInDollars: priceOfLUNARInDollars,
      totalSupply: getDisplayBalance(supply, this.LUNAR.decimal, 0),
      circulatingSupply: getDisplayBalance(LunarCirculatingSupply, this.LUNAR.decimal, 0),
    };
  }

  async getTripolarStat(): Promise<TokenStat> {
    const { TripolarXtriGenesisRewardPool } = this.contracts;
    const [supply, TripolarXtriGenesisRewardPoolSupply, priceInXtri, priceOfOneXtri] = await Promise.all([
      this.TRIPOLAR.totalSupply(),
      this.TRIPOLAR.balanceOf(TripolarXtriGenesisRewardPool.address),
      this.getTokenPriceTripolar(this.TRIPOLAR),
      this.getXtriPrice(),
    ]);
    const TripolarCirculatingSupply = supply.sub(TripolarXtriGenesisRewardPoolSupply);
    const priceOfTripolarInDollars = (Number(priceInXtri) * Number(priceOfOneXtri)).toFixed(2);
    return {
      tokenInFtm: priceInXtri,
      priceInDollars: priceOfTripolarInDollars,
      totalSupply: getDisplayBalance(supply, this.TRIPOLAR.decimal, 0),
      circulatingSupply: getDisplayBalance(TripolarCirculatingSupply, this.TRIPOLAR.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('POLAR') ? this.TOMB : this.TSHARE;
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const ftmAmountBN = await this.FTM.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 24);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(4).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(4).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(4).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(4).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(4).toString(),
    };
  }

  /**
   * Use this method to get price for Tomb
   * @returns TokenStat for TBOND
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const [tombStat, bondTombRatioBN, supply] = await Promise.all([
      this.getTombStat(),
      Treasury.gepbondPremiumRate(),
      this.TBOND.displayedTotalSupply(),
    ]);
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  async getLunarBondStat(): Promise<TokenStat> {
    const { lunarTreasury } = this.contracts;
    const [tombStat, bondTombRatioBN, supply] = await Promise.all([
      this.getLunarStat(),
      lunarTreasury.gepbondPremiumRate(),
      this.LBOND.displayedTotalSupply(),
    ]);
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  async getTripolarBondStat(): Promise<TokenStat> {
    const { tripolarTreasury } = this.contracts;
    const [tombStat, bondTombRatioBN, supply] = await Promise.all([
      this.getTripolarStat(),
      tripolarTreasury.getBondPremiumRate(),
      this.TRIBOND.displayedTotalSupply(),
    ]);
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for TSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { PolarNearLpSpolarRewardPool } = this.contracts;

    const [supply, priceInFTM, tombRewardPoolSupply, priceOfOneFTM] = await Promise.all([
      this.TSHARE.totalSupply(),
      this.getTokenPriceFromPancakeswap(this.TSHARE),
      this.TSHARE.balanceOf(PolarNearLpSpolarRewardPool.address),
      this.getWFTMPriceFromPancakeswap(),
    ]);
    const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.TSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.TSHARE.decimal, 0),
    };
  }

  async getTombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, PolarAuroraGenesisRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.TOMB.address, ethers.utils.parseEther('1'));

    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(PolarAuroraGenesisRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice.div(1e6)),
      priceInDollars: getDisplayBalance(expectedPrice.div(1e6)),
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getLunarStatInEstimatedTWAP(): Promise<TokenStat> {
    const { LunarOracle, LunarLunaGenesisRewardPool } = this.contracts;
    const expectedPrice = await LunarOracle.twap(this.LUNAR.address, ethers.utils.parseEther('1'));

    const supply = await this.LUNAR.totalSupply();
    const tombRewardPoolSupply = await this.LUNAR.balanceOf(LunarLunaGenesisRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.LUNAR.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.LUNAR.decimal, 0),
    };
  }

  async getTripolarStatInEstimatedTWAP(): Promise<TokenStat> {
    const { TripolarOracle, TripolarXtriGenesisRewardPool } = this.contracts;
    const expectedPrice = await TripolarOracle.twap(this.TRIPOLAR.address, ethers.utils.parseEther('1'));

    const supply = await this.TRIPOLAR.totalSupply();
    const tombRewardPoolSupply = await this.TRIPOLAR.balanceOf(TripolarXtriGenesisRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.TRIPOLAR.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TRIPOLAR.decimal, 0),
    };
  }

  async getTombPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getpolarUpdatedPrice();
  }

  async getLunarPriceInLastTWAP(): Promise<BigNumber> {
    const { lunarTreasury } = this.contracts;
    return lunarTreasury.getlunarUpdatedPrice();
  }

  async getTripolarPriceInLastTWAP(): Promise<BigNumber> {
    const { tripolarTreasury } = this.contracts;
    return tripolarTreasury.getTripolarUpdatedPrice();
  }

  async getPolarPreviousEpochTwap(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.previousEpochpolarPrice();
  }

  async getLunarPreviousEpochTwap(): Promise<BigNumber> {
    const { lunarTreasury } = this.contracts;
    return lunarTreasury.previousEpochlunarPrice();
  }

  async getTripolarPreviousEpochTwap(): Promise<BigNumber> {
    const { tripolarTreasury } = this.contracts;
    return tripolarTreasury.previousEpochTripolarPrice();
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBurnablepolarLeft();
  }

  async getBondsPurchasableLunar(): Promise<BigNumber> {
    const { lunarTreasury } = this.contracts;
    return lunarTreasury.getBurnablelunarLeft();
  }

  async getBondsPurchasableTripolar(): Promise<BigNumber> {
    const { tripolarTreasury } = this.contracts;
    return tripolarTreasury.getBurnableTripolarLeft();
  }

  async getBondsRedeemable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getRedeemableBonds();
  }

  async getBondsRedeemableLunar(): Promise<BigNumber> {
    const { lunarTreasury } = this.contracts;
    return lunarTreasury.getRedeemableBonds();
  }

  async getBondsRedeemableTripolar(): Promise<BigNumber> {
    const { tripolarTreasury } = this.contracts;
    return tripolarTreasury.getRedeemableBonds();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    let stat;
    if (bank.earnTokenName === 'POLAR') {
      stat = await this.getTombStat();
    } else if (bank.earnTokenName === 'SPOLAR') {
      stat = await this.getShareStat();
    } else if (bank.earnTokenName === 'TRIPOLAR') {
      stat = await this.getTripolarStat();
    } else {
      stat = await this.getLunarStat();
    }

    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(18).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(18)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'POLAR') {
      if (!contractName.endsWith('PolarRewardPool')) {
        const rewardPerSecond = await poolContract.polarPerSecond();
        if (depositTokenName === 'NEAR') {
          return rewardPerSecond.mul(40000).div(10000).div(18);
        } else if (depositTokenName === 'AURORA') {
          return rewardPerSecond.mul(20000).div(10000).div(18);
        } else if (depositTokenName === 'UST') {
          return rewardPerSecond.mul(20000).div(10000).div(18);
        } else if (depositTokenName === 'LUNA') {
          return rewardPerSecond.mul(20000).div(10000).div(18);
        }
        return rewardPerSecond.div(18);
      }
      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);
      const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
      if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
        return await poolContract.epochPolarPerSecond(1);
      }
      return await poolContract.epochPolarPerSecond(0);
    }
    if (earnTokenName === 'LUNAR') {
      const rewardPerSecond = await poolContract.lunarPerSecond();
      if (depositTokenName === 'LUNA') {
        return rewardPerSecond.mul(50000).div(10000).div(18);
      } else if (depositTokenName === 'POLAR-NEAR-LP') {
        return rewardPerSecond.mul(20000).div(10000).div(18);
      } else if (depositTokenName === 'SPOLAR-NEAR-LP') {
        return rewardPerSecond.mul(10000).div(10000).div(18);
      } else if (depositTokenName === 'POLAR') {
        return rewardPerSecond.mul(5000).div(10000).div(18);
      } else if (depositTokenName === 'PBOND') {
        return rewardPerSecond.mul(5000).div(10000).div(18);
      }
      return rewardPerSecond.div(18);
    }
    if (earnTokenName === 'TRIPOLAR') {
      const rewardPerSecond = await poolContract.tripolarPerSecond();
      if (depositTokenName === 'LUNA') {
        return rewardPerSecond.mul(50000).div(10000).div(18);
      } else if (depositTokenName === 'POLAR-NEAR-LP') {
        return rewardPerSecond.mul(20000).div(10000).div(18);
      } else if (depositTokenName === 'SPOLAR-NEAR-LP') {
        return rewardPerSecond.mul(10000).div(10000).div(18);
      } else if (depositTokenName === 'POLAR') {
        return rewardPerSecond.mul(5000).div(10000).div(18);
      } else if (depositTokenName === 'PBOND') {
        return rewardPerSecond.mul(5000).div(10000).div(18);
      }
      return rewardPerSecond.div(18);
    }
    const [rewardPerSecond, PolarNear, LunarAtluna, PolarStNear, Tripolar] = await Promise.all([
      poolContract.spolarPerSecond(),
      poolContract.poolInfo(0),
      poolContract.poolInfo(4),
      poolContract.poolInfo(5),
      poolContract.poolInfo(6),
    ]);
    if (depositTokenName.startsWith('POLAR-NEAR')) {
      return rewardPerSecond.mul(PolarNear.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('SPOLAR')) {
      return rewardPerSecond.mul(12300).div(41000);
    } else if (depositTokenName.startsWith('PBOND')) {
      return rewardPerSecond.mul(100).div(41000);
    } else if (depositTokenName.startsWith('POLAR-STNEAR')) {
      return rewardPerSecond.mul(PolarStNear.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('POLAR')) {
      return rewardPerSecond.mul(310).div(41000);
    } else if (depositTokenName.startsWith('TRIPOLAR')) {
      return rewardPerSecond.mul(Tripolar.allocPoint).div(41000);
    } else {
      return rewardPerSecond.mul(LunarAtluna.allocPoint).div(41000);
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    let priceOfOneFtmInDollars;
    if (tokenName === 'NEAR') {
      priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      if (tokenName === 'POLAR-NEAR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TOMB);
      } else if (tokenName === 'SPOLAR-NEAR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TSHARE);
      } else if (tokenName === 'LUNAR-LUNA-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LUNAR);
      } else if (tokenName === 'POLAR-STNEAR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TOMB);
      } else if (tokenName === 'TRIPOLAR-XTRI-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TRIPOLAR);
      } else if (tokenName === 'PBOND') {
        const getBondPrice = await this.getBondStat();
        tokenPrice = getBondPrice.priceInDollars;
      } else {
        [tokenPrice, priceOfOneFtmInDollars] = await Promise.all([
          this.getTokenPriceFromPancakeswap(token),
          this.getWFTMPriceFromPancakeswap(),
        ]);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getCurrentEpochLunar(): Promise<BigNumber> {
    const { lunarTreasury } = this.contracts;
    return lunarTreasury.epoch();
  }

  async getCurrentEpochTripolar(): Promise<BigNumber> {
    const { tripolarTreasury } = this.contracts;
    return tripolarTreasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.gepbondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryTombPrice = await Treasury.getpolarPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  async buyLunarBonds(amount: string | number): Promise<TransactionResponse> {
    const { lunarTreasury } = this.contracts;
    const treasuryTombPrice = await lunarTreasury.getlunarPrice();
    return await lunarTreasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  async buyTripolarBonds(amount: string | number): Promise<TransactionResponse> {
    const { tripolarTreasury } = this.contracts;
    const treasuryTombPrice = await tripolarTreasury.getTripolarPrice();
    return await tripolarTreasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }
  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForTomb = await Treasury.getpolarPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }
  async redeemLunarBonds(amount: string): Promise<TransactionResponse> {
    const { lunarTreasury } = this.contracts;
    const priceForTomb = await lunarTreasury.getlunarPrice();
    return await lunarTreasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }
  async redeemTripolarBonds(amount: string): Promise<TransactionResponse> {
    const { tripolarTreasury } = this.contracts;
    const priceForTomb = await tripolarTreasury.getTripolarPrice();
    return await tripolarTreasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      if (bankInfo.closedForStaking === true) continue;
      const token = this.externalTokens[bankInfo.depositTokenName];
      const [tokenPrice, tokenAmountInPool] = await Promise.all([
        this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token),
        token.balanceOf(pool.address),
      ]);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }
    const [ShareStat, masonrytShareBalanceOf, lunarSunriseSpolarBalanceOf, tripolarSunriseBalance] = await Promise.all([
      this.getShareStat(),
      this.TSHARE.balanceOf(this.currentMasonry().address),
      this.TSHARE.balanceOf(this.currentLunarSunrise().address),
      this.TSHARE.balanceOf(this.currentTripolarSunrise().address),
    ]);
    const TSHAREPrice = ShareStat.priceInDollars;
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);

    const lunarSunriseTVL =
      Number(getDisplayBalance(lunarSunriseSpolarBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const tripolarSunriseTVL =
      Number(getDisplayBalance(tripolarSunriseBalance, this.TSHARE.decimal)) * Number(TSHAREPrice);
    return totalValue + masonryTVL + lunarSunriseTVL + tripolarSunriseTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of tomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20): Promise<string> {
    const [lpTokenSupply, tokenBalance] = await Promise.all([lpToken.totalSupply(), token.balanceOf(lpToken.address)]);
    const totalSupply = getFullDisplayBalance(lpTokenSupply, lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(tokenBalance, token.decimal);
    let stat;
    if (token.symbol === 'POLAR') {
      stat = await this.getTombStat();
    } else if (token.symbol === 'LUNAR') {
      stat = await this.getLunarStat();
    } else if (token.symbol === 'TRIPOLAR') {
      stat = await this.getTripolarStat();
    } else {
      stat = await this.getShareStat();
    }

    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'POLAR') {
        return await pool.pendingPOLAR(poolId, account);
      }
      if (earnTokenName === 'LUNAR') {
        return await pool.pendingLUNAR(poolId, account);
      }
      if (earnTokenName === 'TRIPOLAR') {
        return await pool.pendingTripolar(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Masonry;
  }

  currentLunarSunrise(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.lunarSunrise;
  }

  currentTripolarSunrise(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.tripolarSunrise;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { NEAR } = this.config.externalTokens;

    const wftm = new Token(chainId, NEAR[0], NEAR[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);

    try {
      if (tokenContract.symbol === 'PBOND') {
        const { Treasury } = this.contracts;
        const [tombStat, bondTombRatioBN] = await Promise.all([this.getTombStat(), Treasury.gepbondPremiumRate()]);
        const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
        const priceOfTBondInDollars = ((Number(tombStat.priceInDollars) * modifier) / 10).toFixed(2);
        return priceOfTBondInDollars;
      } else {
        const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
        const priceInBUSD = new Route([wftmToToken], token);
        return priceInBUSD.midPrice.toFixed(4);
      }
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceLunar(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { LUNA } = this.config.externalTokens;

    const wftm = new Token(chainId, LUNA[0], LUNA[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);

    try {
      if (tokenContract.symbol === 'LBOND') {
        const { lunarTreasury } = this.contracts;
        const [lunarStat, bondLunarRatioBN] = await Promise.all([
          this.getLunarStat(),
          lunarTreasury.gepbondPremiumRate(),
        ]);
        const modifier = bondLunarRatioBN / 1e18 > 1 ? bondLunarRatioBN / 1e18 : 1;
        const priceOfLBondInDollars = ((Number(lunarStat.priceInDollars) * modifier) / 10).toFixed(2);
        return priceOfLBondInDollars;
      } else {
        const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
        const priceInBUSD = new Route([wftmToToken], token);
        return priceInBUSD.midPrice.toFixed(4);
      }
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceTripolar(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { XTRI } = this.config.externalTokens;

    const wftm = new Token(chainId, XTRI[0], XTRI[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);

    try {
      if (tokenContract.symbol === 'TRIBOND') {
        const { tripolarTreasury } = this.contracts;
        const [tripolarStat, bondTripolarRatioBN] = await Promise.all([
          this.getTripolarStat(),
          tripolarTreasury.getBondPremiumRate(),
        ]);
        const modifier = bondTripolarRatioBN / 1e18 > 1 ? bondTripolarRatioBN / 1e18 : 1;
        const priceOfTriBondInDollars = ((Number(tripolarStat.priceInDollars) * modifier) / 10).toFixed(2);
        return priceOfTriBondInDollars;
      } else {
        const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
        const priceInBUSD = new Route([wftmToToken], token);
        return priceInBUSD.midPrice.toFixed(4);
      }
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getWFTMPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { NEAR, USDC } = this.externalTokens;
    try {
      const near_usdc_lp_pair = this.externalTokens['NEAR-USDC-LP'];
      let [near_amount_BN, usdc_amount_BN] = await Promise.all([
        NEAR.balanceOf(near_usdc_lp_pair.address),
        USDC.balanceOf(near_usdc_lp_pair.address),
      ]);
      let near_amount = Number(getFullDisplayBalance(near_amount_BN, NEAR.decimal));
      let usdc_amount = Number(getFullDisplayBalance(usdc_amount_BN, USDC.decimal));
      return (usdc_amount / near_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WFTM: ${err}`);
    }
  }

  async getLUNAPrice(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { LUNA, NEAR, USDC } = this.externalTokens;
    try {
      const near_usdc_lp_pair = this.externalTokens['NEAR-USDC-LP'];
      let near_amount_BN = await NEAR.balanceOf(near_usdc_lp_pair.address);
      let near_amount = Number(getFullDisplayBalance(near_amount_BN, NEAR.decimal));
      let usdc_amount_BN = await USDC.balanceOf(near_usdc_lp_pair.address);
      let usdc_amount = Number(getFullDisplayBalance(usdc_amount_BN, USDC.decimal));
      const near_price = usdc_amount / near_amount;

      const luna_near_lp_pair = this.externalTokens['LUNA-NEAR-LP'];
      var luna_amount_BN = await LUNA.balanceOf(luna_near_lp_pair.address);
      var luna_amount = Number(getFullDisplayBalance(luna_amount_BN, LUNA.decimal));
      near_amount_BN = await NEAR.balanceOf(luna_near_lp_pair.address);
      near_amount = Number(getFullDisplayBalance(near_amount_BN, NEAR.decimal));
      const luna_price = near_amount / luna_amount;
      return (near_price * luna_price).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of LUNA: ${err}`);
    }
  }

  async getXtriPrice(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { XTRI, STNEAR, NEAR, USDC } = this.externalTokens;
    try {
      const near_usdc_lp_pair = this.externalTokens['NEAR-USDC-LP'];
      let near_amount_BN = await NEAR.balanceOf(near_usdc_lp_pair.address);
      let near_amount = Number(getFullDisplayBalance(near_amount_BN, NEAR.decimal));
      let usdc_amount_BN = await USDC.balanceOf(near_usdc_lp_pair.address);
      let usdc_amount = Number(getFullDisplayBalance(usdc_amount_BN, USDC.decimal));
      const near_price = usdc_amount / near_amount;

      const stnear_near_lp_pair = this.externalTokens['STNEAR-NEAR-LP'];
      var stnear_amount_BN = await STNEAR.balanceOf(stnear_near_lp_pair.address);
      var stnear_amount = Number(getFullDisplayBalance(stnear_amount_BN, STNEAR.decimal));
      near_amount_BN = await NEAR.balanceOf(stnear_near_lp_pair.address);
      near_amount = Number(getFullDisplayBalance(near_amount_BN, NEAR.decimal));
      const stnear_price = near_amount / stnear_amount;

      const xtri_stnear_lp_pair = this.externalTokens['STNEAR-XTRI-LP'];
      var xtri_amount_BN = await XTRI.balanceOf(xtri_stnear_lp_pair.address);
      var xtri_amount = Number(getFullDisplayBalance(xtri_amount_BN, XTRI.decimal));
      stnear_amount_BN = await STNEAR.balanceOf(xtri_stnear_lp_pair.address);
      stnear_amount = Number(getFullDisplayBalance(stnear_amount_BN, STNEAR.decimal));
      const xtri_price = stnear_amount / xtri_amount;
      return (near_price * stnear_price * xtri_price).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of XTRI: ${err}`);
    }
  }
  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryAPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTombStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  async getLunarSunriseAPR() {
    const Masonry = this.currentLunarSunrise();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getLunarStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  async getTripolarSunriseAPR() {
    const Masonry = this.currentTripolarSunrise();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTripolarStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }
  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  async canUserClaimRewardFromLunarSunrise(): Promise<boolean> {
    const Masonry = this.currentLunarSunrise();
    return await Masonry.canClaimReward(this.myAccount);
  }

  async canUserClaimRewardFromTripolarSunrise(): Promise<boolean> {
    const Masonry = this.currentTripolarSunrise();
    return await Masonry.canClaimReward(this.myAccount);
  }
  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async canUserUnstakeFromLunarSunrise(): Promise<boolean> {
    const LunarSunrise = this.currentLunarSunrise();
    const canWithdraw = await LunarSunrise.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnLunarSunrise();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async canUserUnstakeFromTripolarSunrise(): Promise<boolean> {
    const TripolarSunrise = this.currentTripolarSunrise();
    const canWithdraw = await TripolarSunrise.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnTripolarSunrise();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async getTotalStakedInLunarSunrise(): Promise<BigNumber> {
    const Masonry = this.currentLunarSunrise();
    return await Masonry.totalSupply();
  }

  async getTotalStakedInTripolarSunrise(): Promise<BigNumber> {
    const Masonry = this.currentTripolarSunrise();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old masonry. please withdraw and deposit the TSHARE again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async stakeShareToLunarSunrise(amount: string): Promise<TransactionResponse> {
    const LunarSunrise = this.currentLunarSunrise();
    return await LunarSunrise.stake(decimalToBalance(amount));
  }

  async stakeShareToTripolarSunrise(amount: string): Promise<TransactionResponse> {
    const TripolarSunrise = this.currentTripolarSunrise();
    return await TripolarSunrise.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getShareOf(this.myAccount);
    }
    return await Masonry.balanceOf(this.myAccount);
  }

  async getStakedSharesOnLunarSunrise(): Promise<BigNumber> {
    const LunarSunrise = this.currentLunarSunrise();
    return await LunarSunrise.balanceOf(this.myAccount);
  }

  async getStakedSharesOnTripolarSunrise(): Promise<BigNumber> {
    const TripolarSunrise = this.currentTripolarSunrise();
    return await TripolarSunrise.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getCashEarningsOf(this.myAccount);
    }
    return await Masonry.earned(this.myAccount);
  }

  async getEarningsOnLunarSunrise(): Promise<BigNumber> {
    const Masonry = this.currentLunarSunrise();
    return await Masonry.earned(this.myAccount);
  }

  async getEarningsOnTripolarSunrise(): Promise<BigNumber> {
    const Masonry = this.currentTripolarSunrise();
    return await Masonry.earned(this.myAccount);
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async withdrawShareFromLunarSunrise(amount: string): Promise<TransactionResponse> {
    const LunarSunrise = this.currentLunarSunrise();
    return await LunarSunrise.withdraw(decimalToBalance(amount));
  }

  async withdrawShareFromTripolarSunrise(amount: string): Promise<TransactionResponse> {
    const TripolarSunrise = this.currentTripolarSunrise();
    return await TripolarSunrise.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.claimDividends();
    }
    return await Masonry.claimReward();
  }

  async harvestLunarFromLunarSunrise(): Promise<TransactionResponse> {
    const Masonry = this.currentLunarSunrise();
    return await Masonry.claimReward();
  }

  async harvestTripolarFromTripolarSunrise(): Promise<TransactionResponse> {
    const Masonry = this.currentTripolarSunrise();
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async exitFromLunarSunrise(): Promise<TransactionResponse> {
    const LunarMasonry = this.currentLunarSunrise();
    return await LunarMasonry.exit();
  }

  async exitFromTripolarSunrise(): Promise<TransactionResponse> {
    const TripolarMasonry = this.currentTripolarSunrise();
    return await TripolarMasonry.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }

  async getLunarTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { lunarTreasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await lunarTreasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }

  async getTripolarTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { tripolarTreasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await tripolarTreasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Masonry.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async getUserClaimRewardTimeLunar(): Promise<AllocationTime> {
    const { lunarSunrise, lunarTreasury } = this.contracts;
    const nextEpochTimestamp = await lunarSunrise.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await lunarSunrise.epoch();
    const mason = await lunarSunrise.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await lunarTreasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await lunarSunrise.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async getUserClaimRewardTimeTripolar(): Promise<AllocationTime> {
    const { tripolarSunrise, tripolarTreasury } = this.contracts;
    const nextEpochTimestamp = await tripolarSunrise.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await tripolarSunrise.epoch();
    const mason = await tripolarSunrise.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await tripolarTreasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await tripolarSunrise.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint();
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Masonry.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async getUserUnstakeTimeLunarSunrise(): Promise<AllocationTime> {
    const { lunarSunrise, lunarTreasury } = this.contracts;
    const nextEpochTimestamp = await lunarSunrise.nextEpochPoint();
    const currentEpoch = await lunarSunrise.epoch();
    const mason = await lunarSunrise.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await lunarTreasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await lunarSunrise.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnLunarSunrise();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async getUserUnstakeTimeTripolarSunrise(): Promise<AllocationTime> {
    const { tripolarSunrise, tripolarTreasury } = this.contracts;
    const nextEpochTimestamp = await tripolarSunrise.nextEpochPoint();
    const currentEpoch = await tripolarSunrise.epoch();
    const mason = await tripolarSunrise.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await tripolarTreasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await tripolarSunrise.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnTripolarSunrise();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'POLAR') {
        asset = this.TOMB;
        assetUrl = 'https://polarisfinance.io/logos/polar-token.svg';
      } else if (assetName === 'SPOLAR') {
        asset = this.TSHARE;
        assetUrl = 'https://polarisfinance.io/logos/spolar-token.svg';
      } else if (assetName === 'PBOND') {
        asset = this.TBOND;
        assetUrl = 'https://polarisfinance.io/logos/pbond-token.svg';
      } else if (assetName === 'LUNAR') {
        asset = this.LUNAR;
        assetUrl = 'https://polarisfinance.io/logos/lunar-token.svg';
      } else if (assetName === 'LBOND') {
        asset = this.LBOND;
        assetUrl = 'https://polarisfinance.io/logos/lbond-token.svg';
      } else if (assetName === 'TRIPOLAR') {
        asset = this.TRIPOLAR;
        assetUrl = 'https://polarisfinance.io/logos/tripolar-token.svg';
      } else if (assetName === 'TRIBOND') {
        asset = this.TRIBOND;
        assetUrl = 'https://polarisfinance.io/logos/tribond-token.svg';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  async provideTombFtmLP(ftmAmount: string, tombAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(ftmAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(
      tombAmount,
      tombAmount.mul(992).div(1000),
      parseUnits(ftmAmount, 18).mul(992).div(1000),
      overrides,
    );
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.TOMBWFTM_LP.getReserves();
    let quote;
    if (tokenName === 'POLAR') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let masonryFundEvents = await Treasury.queryFilter(treasuryMasonryFundedFilter);
    var events: any[] = [];
    masonryFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].masonryFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === FTM_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === TOMB_TICKER ? this.TOMB : this.TSHARE;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === FTM_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === TOMB_TICKER ? this.TOMB : this.TSHARE;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async swapTBondToTShare(tbondAmount: BigNumber): Promise<TransactionResponse> {
    const { TShareSwapper } = this.contracts;
    return await TShareSwapper.swapTBondToTShare(tbondAmount);
  }
  async estimateAmountOfTShare(tbondAmount: string): Promise<string> {
    const { TShareSwapper } = this.contracts;
    try {
      const estimateBN = await TShareSwapper.estimateAmountOfTShare(parseUnits(tbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate tshare amount: ${err}`);
    }
  }

  async getTShareSwapperStat(address: string): Promise<TShareSwapperStat> {
    const { TShareSwapper } = this.contracts;
    const tshareBalanceBN = await TShareSwapper.getTShareBalance();
    const tbondBalanceBN = await TShareSwapper.getTBondBalance(address);
    // const tombPriceBN = await TShareSwapper.getTombPrice();
    // const tsharePriceBN = await TShareSwapper.getTSharePrice();
    const rateTSharePerTombBN = await TShareSwapper.getTShareAmountPerTomb();
    const tshareBalance = getDisplayBalance(tshareBalanceBN, 18, 5);
    const tbondBalance = getDisplayBalance(tbondBalanceBN, 18, 5);
    return {
      tshareBalance: tshareBalance.toString(),
      tbondBalance: tbondBalance.toString(),
      // tombPrice: tombPriceBN.toString(),
      // tsharePrice: tsharePriceBN.toString(),
      rateTSharePerTomb: rateTSharePerTombBN.toString(),
    };
  }
}
