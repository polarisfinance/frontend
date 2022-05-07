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
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, POLAR_TICKER } from '../utils/constants';
/**
 * An API module of Tomb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
function numberWithSpaces(x: Number) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}
export class PolarisFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };

  POLARWFTM_LP: Contract;
  POLAR: ERC20;
  SPOLAR: ERC20;
  PBOND: ERC20;
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
    this.POLAR = new ERC20(deployments.polar.address, provider, 'POLAR');
    this.SPOLAR = new ERC20(deployments.sPolar.address, provider, 'SPOLAR');
    this.PBOND = new ERC20(deployments.pBond.address, provider, 'PBOND');
    this.FTM = this.externalTokens['NEAR'];

    this.LUNAR = new ERC20(deployments.lunar.address, provider, 'LUNAR');
    this.LBOND = new ERC20(deployments.lBond.address, provider, 'LBOND');

    this.TRIPOLAR = new ERC20(deployments.tripolar.address, provider, 'TRIPOLAR');
    this.TRIBOND = new ERC20(deployments.triBond.address, provider, 'TRIBOND');
    // Uniswap V2 Pair
    this.POLARWFTM_LP = new Contract(externalTokens['POLAR-NEAR-LP'][0], IUniswapV2PairABI, provider);

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
      this.POLAR,
      this.SPOLAR,
      this.PBOND,
      this.LUNAR,
      this.LBOND,
      this.TRIPOLAR,
      this.TRIBOND,
      ...Object.values(this.externalTokens),
    ];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.POLARWFTM_LP = this.POLARWFTM_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  /**
   * @returns TokenStat
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */

  async getStat(token: string): Promise<TokenStat> {
    let supply: BigNumber,
      rewardPoolSupply: BigNumber,
      rewardPoolSupply2: BigNumber,
      priceInToken: string,
      priceOfOneToken: string,
      circulatingSupply: BigNumber,
      priceInDollars: string;

    if (token === 'POLAR') {
      const { PolarAuroraGenesisRewardPool, PolarNearLpPolarRewardPool } = this.contracts;
      [supply, rewardPoolSupply, rewardPoolSupply2, priceInToken, priceOfOneToken] = await Promise.all([
        this.POLAR.totalSupply(),
        this.POLAR.balanceOf(PolarAuroraGenesisRewardPool.address),
        this.POLAR.balanceOf(PolarNearLpPolarRewardPool.address),
        this.getTokenPriceFromPancakeswap(this.POLAR),
        this.getWFTMPriceFromPancakeswap(),
      ]);
      circulatingSupply = supply.sub(rewardPoolSupply).sub(rewardPoolSupply2);
      priceInDollars = (Number(priceInToken) * Number(priceOfOneToken)).toFixed(2);
    }

    if (token === 'PBOND') {
      const { Treasury } = this.contracts;
      let stat: TokenStat, ratio: number;
      [supply, stat, ratio] = await Promise.all([
        this.PBOND.totalSupply(),
        this.getStat('POLAR'),
        Treasury.gepbondPremiumRate(),
      ]);
      const modifier = ratio / 1e18 > 1 ? ratio / 1e18 : 1;
      priceInToken = (Number(stat.tokenInFtm) * modifier).toFixed(2);
      priceInDollars = (Number(stat.priceInDollars) * modifier).toFixed(2);
      circulatingSupply = supply;
    }

    if (token === 'LUNAR') {
      const { LunarLunaGenesisRewardPool } = this.contracts;
      [supply, rewardPoolSupply, priceInToken, priceOfOneToken] = await Promise.all([
        this.LUNAR.totalSupply(),
        this.LUNAR.balanceOf(LunarLunaGenesisRewardPool.address),
        this.getTokenPriceLunar(this.LUNAR),
        this.getLUNAPrice(),
      ]);
      circulatingSupply = supply.sub(rewardPoolSupply);
      priceInDollars = (Number(priceInToken) * Number(priceOfOneToken)).toFixed(2);
    }

    if (token === 'LBOND') {
      const { lunarTreasury } = this.contracts;
      let stat: TokenStat, ratio: number;
      [supply, stat, ratio] = await Promise.all([
        this.LBOND.totalSupply(),
        this.getStat('LUNAR'),
        lunarTreasury.gepbondPremiumRate(),
      ]);
      const modifier = ratio / 1e18 > 1 ? ratio / 1e18 : 1;
      priceInToken = (Number(stat.tokenInFtm) * modifier).toFixed(2);
      priceInDollars = (Number(stat.priceInDollars) * modifier).toFixed(2);
      circulatingSupply = supply;
    }

    if (token === 'TRIPOLAR') {
      const { TripolarXtriGenesisRewardPool } = this.contracts;
      [supply, rewardPoolSupply, priceInToken, priceOfOneToken] = await Promise.all([
        this.TRIPOLAR.totalSupply(),
        this.TRIPOLAR.balanceOf(TripolarXtriGenesisRewardPool.address),
        this.getTokenPriceTripolar(this.TRIPOLAR),
        this.getXtriPrice(),
      ]);
      circulatingSupply = supply.sub(rewardPoolSupply);
      priceInDollars = (Number(priceInToken) * Number(priceOfOneToken)).toFixed(2);
    }

    if (token === 'TRIBOND') {
      const { tripolarTreasury } = this.contracts;
      let stat: TokenStat, ratio: number;
      [supply, stat, ratio] = await Promise.all([
        this.TRIBOND.totalSupply(),
        this.getStat('TRIPOLAR'),
        tripolarTreasury.getBondPremiumRate(),
      ]);
      const modifier = ratio / 1e18 > 1 ? ratio / 1e18 : 1;
      priceInToken = (Number(stat.tokenInFtm) * modifier).toFixed(2);
      priceInDollars = (Number(stat.priceInDollars) * modifier).toFixed(2);
      circulatingSupply = supply;
    }

    if (token === 'SPOLAR') {
      const { PolarNearLpSpolarRewardPool } = this.contracts;
      [supply, rewardPoolSupply, priceInToken, priceOfOneToken] = await Promise.all([
        this.SPOLAR.totalSupply(),
        this.SPOLAR.balanceOf(PolarNearLpSpolarRewardPool.address),
        this.getTokenPriceFromPancakeswap(this.SPOLAR),
        this.getWFTMPriceFromPancakeswap(),
      ]);
      circulatingSupply = supply.sub(rewardPoolSupply);
      priceInDollars = (Number(priceInToken) * Number(priceOfOneToken)).toFixed(2);
    }

    return {
      tokenInFtm: priceInToken,
      priceInDollars: priceInDollars,
      totalSupply: getDisplayBalance(supply, 18, 0),
      circulatingSupply: getDisplayBalance(circulatingSupply, 18, 0),
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
    const token0 = name.startsWith('POLAR') ? this.POLAR : this.SPOLAR;
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

  async getTokenEstimatedTWAP(token: string): Promise<string> {
    let expectedPrice: BigNumber;
    if (token === 'POLAR') {
      expectedPrice = await this.contracts.SeigniorageOracle.twap(this.POLAR.address, ethers.utils.parseEther('1'));
    }
    if (token === 'LUNAR') {
      expectedPrice = await this.contracts.LunarOracle.twap(this.LUNAR.address, ethers.utils.parseEther('1'));
    }
    if (token === 'TRIPOLAR') {
      expectedPrice = await this.contracts.TripolarOracle.twap(this.TRIPOLAR.address, ethers.utils.parseEther('1'));
    }
    return token === 'POLAR' ? getDisplayBalance(expectedPrice.div(1e6)) : getDisplayBalance(expectedPrice);
  }

  async getTokenPriceInLastTWAP(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return this.contracts.Treasury.getpolarUpdatedPrice();
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarTreasury.getlunarUpdatedPrice();
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarTreasury.getTripolarUpdatedPrice();
    }
  }

  async getTokenPreviousEpochTWAP(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return this.contracts.Treasury.previousEpochpolarPrice();
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarTreasury.previousEpochlunarPrice();
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarTreasury.previousEpochTripolarPrice();
    }
  }

  async getBondsPurchasable(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return this.contracts.Treasury.getBurnablepolarLeft();
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarTreasury.getBurnablelunarLeft();
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarTreasury.getBurnableTripolarLeft();
    }
  }

  async getBondsRedeemable(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return this.contracts.Treasury.getRedeemableBonds();
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarTreasury.getRedeemableBonds();
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarTreasury.getRedeemableBonds();
    }
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

    const stat = await this.getStat(bank.earnTokenName);

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
      TVL: numberWithSpaces(Number(TVL.toFixed(2))),
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
      if (depositTokenName === 'xTRI') {
        return rewardPerSecond.mul(30000).div(50000);
      } else {
        return rewardPerSecond.mul(5000).div(50000);
      }
    }
    const [rewardPerSecond, SpolarNear, PolarNear, LunarAtluna, PolarStNear, Tripolar, PolarLunar] = await Promise.all([
      poolContract.spolarPerSecond(),
      poolContract.poolInfo(1),
      poolContract.poolInfo(0),
      poolContract.poolInfo(4),
      poolContract.poolInfo(5),
      poolContract.poolInfo(6),
      poolContract.poolInfo(7),
    ]);
    if (depositTokenName.startsWith('POLAR-NEAR')) {
      return rewardPerSecond.mul(PolarNear.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('SPOLAR')) {
      return rewardPerSecond.mul(SpolarNear.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('PBOND')) {
      return rewardPerSecond.mul(0).div(41000);
    } else if (depositTokenName.startsWith('POLAR-STNEAR')) {
      return rewardPerSecond.mul(PolarStNear.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('POLAR-NEAR')) {
      return rewardPerSecond.mul(0).div(41000);
    } else if (depositTokenName.startsWith('TRIPOLAR')) {
      return rewardPerSecond.mul(Tripolar.allocPoint).div(41000);
    } else if (depositTokenName.startsWith('POLAR-LUNAR')) {
      return rewardPerSecond.mul(PolarLunar.allocPoint).div(41000);
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
        tokenPrice = await this.getLPTokenPrice(token, this.POLAR);
      } else if (tokenName === 'SPOLAR-NEAR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.SPOLAR);
      } else if (tokenName === 'LUNAR-LUNA-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LUNAR);
      } else if (tokenName === 'POLAR-STNEAR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.POLAR);
      } else if (tokenName === 'TRIPOLAR-xTRI-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TRIPOLAR);
      } else if (tokenName === 'POLAR-LUNAR-LP') {
        tokenPrice = await this.getLPTokenPricePolarLunar(token, this.POLAR, this.LUNAR);
      } else if (tokenName === 'PBOND') {
        const getBondPrice = await this.getStat('PBOND');
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

  async getCurrentEpoch(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return this.contracts.Treasury.epoch();
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarTreasury.epoch();
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarTreasury.epoch();
    }
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */

  async buyBonds(amount: string | number, token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Treasury.buyBonds(
        decimalToBalance(amount),
        await this.contracts.Treasury.getpolarPrice(),
      );
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarTreasury.buyBonds(
        decimalToBalance(amount),
        await this.contracts.lunarTreasury.getlunarPrice(),
      );
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarTreasury.buyBonds(
        decimalToBalance(amount),
        await this.contracts.tripolarTreasury.getTripolarPrice(),
      );
    }
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */

  async redeemBonds(amount: string, token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Treasury.redeemBonds(
        decimalToBalance(amount),
        await this.contracts.Treasury.getpolarPrice(),
      );
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarTreasury.redeemBonds(
        decimalToBalance(amount),
        await this.contracts.lunarTreasury.getlunarPrice(),
      );
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarTreasury.redeemBonds(
        decimalToBalance(amount),
        await this.contracts.tripolarTreasury.getTripolarPrice(),
      );
    }
  }

  async getTotalValueLocked(): Promise<Number> {
    let [totalValue, bankListPrice, bankListBalance, bankListNames, bankDictPrice, bankDictBalance] = [
      0,
      [],
      [],
      [],
      {},
      {},
    ];
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      if (bankInfo.closedForStaking === true) continue;
      const token = this.externalTokens[bankInfo.depositTokenName];
      bankListPrice.push(this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token));
      bankListBalance.push(token.balanceOf(pool.address));
      bankListNames.push(bankInfo.contract);
    }
    let bankListPricePromise = Promise.all(bankListPrice);
    let bankListBalancePromise = Promise.all(bankListBalance);
    let [
      bankPrice,
      bankBalance,
      masonrytShareBalanceOf,
      lunarSunriseSpolarBalanceOf,
      tripolarSunriseBalance,
      priceInFTM,
      priceOfOneFTM,
    ] = await Promise.all([
      bankListPricePromise,
      bankListBalancePromise,
      this.SPOLAR.balanceOf(this.contracts.Masonry.address),
      this.SPOLAR.balanceOf(this.contracts.lunarSunrise.address),
      this.SPOLAR.balanceOf(this.contracts.tripolarSunrise.address),
      this.getTokenPriceFromPancakeswap(this.SPOLAR),
      this.getWFTMPriceFromPancakeswap(),
    ]);
    for (let i = 0; i < bankListNames.length; i++) {
      bankDictPrice[bankListNames[i]] = bankPrice[i];
      bankDictBalance[bankListNames[i]] = bankBalance[i];
    }
    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.closedForStaking === true) continue;
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = bankDictPrice[bankInfo.contract];
      const tokenAmountInPool = bankDictBalance[bankInfo.contract];
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }
    const SPOLARPrice = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.SPOLAR.decimal)) * Number(SPOLARPrice);
    const lunarSunriseTVL =
      Number(getDisplayBalance(lunarSunriseSpolarBalanceOf, this.SPOLAR.decimal)) * Number(SPOLARPrice);
    const tripolarSunriseTVL =
      Number(getDisplayBalance(tripolarSunriseBalance, this.SPOLAR.decimal)) * Number(SPOLARPrice);
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

    const stat = await this.getStat(token.symbol);

    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async getLPTokenPricePolarLunar(lpToken: ERC20, token0: ERC20, token1: ERC20): Promise<string> {
    const [lpTokenSupply, token0Balance, token1Balance, statToken0, statToken1] = await Promise.all([
      lpToken.totalSupply(),
      token0.balanceOf(lpToken.address),
      token1.balanceOf(lpToken.address),
      this.getStat(token0.symbol),
      this.getStat(token1.symbol),
    ]);
    const totalSupply = getFullDisplayBalance(lpTokenSupply, lpToken.decimal);
    //Get amount of tokenA
    const token0Supply = getFullDisplayBalance(token0Balance, token0.decimal);
    const token1Supply = getFullDisplayBalance(token1Balance, token1.decimal);

    const priceOfToken0 = statToken0.priceInDollars;
    const priceOfToken1 = statToken1.priceInDollars;
    const token0InLP = Number(token0Supply) / Number(totalSupply);
    const token1InLP = Number(token1Supply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken0) * token0InLP + Number(priceOfToken1) * token1InLP) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
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
        const [tombStat, bondTombRatioBN] = await Promise.all([this.getStat('POLAR'), Treasury.gepbondPremiumRate()]);
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
          this.getStat('LUNAR'),
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
    const { xTRI } = this.config.externalTokens;

    const wftm = new Token(chainId, xTRI[0], xTRI[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);

    try {
      if (tokenContract.symbol === 'TRIBOND') {
        const { tripolarTreasury } = this.contracts;
        const [tripolarStat, bondTripolarRatioBN] = await Promise.all([
          this.getStat('TRIPOLAR'),
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
    const { xTRI, STNEAR, NEAR, USDC } = this.externalTokens;
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

      const xtri_stnear_lp_pair = this.externalTokens['STNEAR-xTRI-LP'];
      var xtri_amount_BN = await xTRI.balanceOf(xtri_stnear_lp_pair.address);
      var xtri_amount = Number(getFullDisplayBalance(xtri_amount_BN, xTRI.decimal));
      stnear_amount_BN = await STNEAR.balanceOf(xtri_stnear_lp_pair.address);
      stnear_amount = Number(getFullDisplayBalance(stnear_amount_BN, STNEAR.decimal));
      const xtri_price = stnear_amount / xtri_amount;
      return (near_price * stnear_price * xtri_price).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of xTRI: ${err}`);
    }
  }
  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getSunriseAPR(token: string) {
    let latestSnapshotIndex: BigNumber,
      lastHistory: BigNumber,
      SPOLARPrice: TokenStat,
      sunrise: Contract,
      tokenPricePromise: Promise<TokenStat>,
      tokenPrice: TokenStat;
    if (token === 'POLAR') {
      sunrise = this.contracts.Masonry;
    }
    if (token === 'LUNAR') {
      sunrise = this.contracts.lunarSunrise;
    }
    if (token === 'TRIPOLAR') {
      sunrise = this.contracts.tripolarSunrise;
    }
    tokenPricePromise = this.getStat(token);
    latestSnapshotIndex = await sunrise.latestSnapshotIndex();
    [lastHistory, SPOLARPrice, tokenPrice] = await Promise.all([
      sunrise.masonryHistory(latestSnapshotIndex),
      this.getStat('SPOLAR'),
      tokenPricePromise,
    ]);
    const lastRewardsReceived = lastHistory[1];
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(tokenPrice.priceInDollars) * 4;
    const masonrytShareBalanceOf = await this.SPOLAR.balanceOf(sunrise.address);
    const masonryTVL =
      Number(getDisplayBalance(masonrytShareBalanceOf, this.SPOLAR.decimal)) * Number(SPOLARPrice.priceInDollars);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */

  async canUserClaimRewardFromSunrise(token: string): Promise<boolean> {
    if (token === 'POLAR') {
      return this.contracts.Masonry.canClaimReward(this.myAccount);
    }
    if (token === 'LUNAR') {
      return this.contracts.lunarSunrise.canClaimReward(this.myAccount);
    }
    if (token === 'TRIPOLAR') {
      return this.contracts.tripolarSunrise.canClaimReward(this.myAccount);
    }
    if (token === 'OLDTRIPOLAR') {
      return this.contracts.tripolarSunriseOld.canClaimReward(this.myAccount);
    }
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */

  async canUserUnstakeFromSunrise(token: string): Promise<boolean> {
    let canWithdraw: boolean, stakedAmount: BigNumber, sunrise: Contract;
    if (token === 'POLAR') {
      sunrise = this.contracts.Masonry;
    }
    if (token === 'LUNAR') {
      sunrise = this.contracts.lunarSunrise;
    }
    if (token === 'TRIPOLAR') {
      sunrise = this.contracts.tripolarSunrise;
    }
    if (token === 'OLDTRIPOLAR') {
      sunrise = this.contracts.tripolarSunriseOld;
    }
    [canWithdraw, stakedAmount] = await Promise.all([
      sunrise.canWithdraw(this.myAccount),
      this.getStakedSpolarOnSunrise(token),
    ]);
    const notStaked = Number(getDisplayBalance(stakedAmount, this.SPOLAR.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async getTotalStakedInSunrise(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.totalSupply();
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.totalSupply();
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.totalSupply();
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.totalSupply();
    }
  }

  async stakeSpolarToSunrise(amount: string, token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.stake(decimalToBalance(amount));
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.stake(decimalToBalance(amount));
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.stake(decimalToBalance(amount));
    }
  }

  async getStakedSpolarOnSunrise(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.balanceOf(this.myAccount);
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.balanceOf(this.myAccount);
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.balanceOf(this.myAccount);
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.balanceOf(this.myAccount);
    }
  }

  async getEarningsOnSunrise(token: string): Promise<BigNumber> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.earned(this.myAccount);
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.earned(this.myAccount);
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.earned(this.myAccount);
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.earned(this.myAccount);
    }
  }

  async withdrawSpolarFromSunrise(amount: string, token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.withdraw(this.myAccount);
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.withdraw(this.myAccount);
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.withdraw(this.myAccount);
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.withdraw(this.myAccount);
    }
  }

  async claimRewardFromSunrise(token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.claimReward();
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.claimReward();
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.claimReward();
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.claimReward();
    }
  }

  async exitFromSunrise(token: string): Promise<TransactionResponse> {
    if (token === 'POLAR') {
      return await this.contracts.Masonry.exit();
    }
    if (token === 'LUNAR') {
      return await this.contracts.lunarSunrise.exit();
    }
    if (token === 'TRIPOLAR') {
      return await this.contracts.tripolarSunrise.exit();
    }
    if (token === 'OLDTRIPOLAR') {
      return await this.contracts.tripolarSunriseOld.exit();
    }
  }

  async getTreasuryNextAllocationTime(token: string): Promise<AllocationTime> {
    let treasury: Contract;
    if (token === 'POLAR') {
      treasury = this.contracts.Treasury;
    }
    if (token === 'LUNAR') {
      treasury = this.contracts.lunarTreasury;
    }
    if (token === 'TRIPOLAR') {
      treasury = this.contracts.tripolarTreasury;
    }

    const nextEpochTimestamp: BigNumber = await treasury.nextEpochPoint();
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

  async getUserClaimRewardTime(token: string): Promise<AllocationTime> {
    let sunrise: Contract, treasury: Contract;
    if (token === 'POLAR') {
      treasury = this.contracts.Treasury;
      sunrise = this.contracts.Masonry;
    }
    if (token === 'LUNAR') {
      treasury = this.contracts.lunarTreasury;
      sunrise = this.contracts.lunarSunrise;
    }
    if (token === 'TRIPOLAR') {
      treasury = this.contracts.tripolarTreasury;
      sunrise = this.contracts.tripolarSunrise;
    }
    if (token === 'OLDTRIPOLAR') {
      treasury = this.contracts.tripolarTreasuryOld;
      sunrise = this.contracts.tripolarSunriseOld;
    }
    const [nextEpochTimestamp, currentEpoch, mason, period, rewardLockupEpochs] = await Promise.all([
      sunrise.nextEpochPoint(),
      sunrise.epoch(),
      sunrise.masons(this.myAccount),
      treasury.PERIOD(),
      sunrise.rewardLockupEpochs(),
    ]);

    const startTimeEpoch = mason.epochTimerStart;
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
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
  async getUserUnstakeTime(token: string): Promise<AllocationTime> {
    let sunrise: Contract, treasury: Contract;
    if (token === 'POLAR') {
      treasury = this.contracts.Treasury;
      sunrise = this.contracts.Masonry;
    }
    if (token === 'LUNAR') {
      treasury = this.contracts.lunarTreasury;
      sunrise = this.contracts.lunarSunrise;
    }
    if (token === 'TRIPOLAR') {
      treasury = this.contracts.tripolarTreasury;
      sunrise = this.contracts.tripolarSunrise;
    }
    if (token === 'OLDTRIPOLAR') {
      treasury = this.contracts.tripolarTreasuryOld;
      sunrise = this.contracts.tripolarSunriseOld;
    }

    const [nextEpochTimestamp, currentEpoch, mason, period, withdrawLockupEpochs, stakedAmount] = await Promise.all([
      sunrise.nextEpochPoint(),
      sunrise.epoch(),
      sunrise.masons(this.myAccount),
      treasury.PERIOD(),
      sunrise.withdrawLockupEpochs(),
      this.getStakedSpolarOnSunrise('POLAR'),
    ]);

    const startTimeEpoch = mason.epochTimerStart;
    const PeriodInHours = period / 60 / 60;
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
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
        asset = this.POLAR;
        assetUrl = 'https://polarisfinance.io/logos/polar-token.svg';
      } else if (assetName === 'SPOLAR') {
        asset = this.SPOLAR;
        assetUrl = 'https://polarisfinance.io/logos/spolar-token.svg';
      } else if (assetName === 'PBOND') {
        asset = this.PBOND;
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
    const { _reserve0, _reserve1 } = await this.POLARWFTM_LP.getReserves();
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
      const token = tokenName === POLAR_TICKER ? this.POLAR : this.SPOLAR;
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
      const token = tokenName === POLAR_TICKER ? this.POLAR : this.SPOLAR;
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
