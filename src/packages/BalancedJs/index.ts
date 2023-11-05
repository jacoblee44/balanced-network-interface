import BigNumber from 'bignumber.js';
import { isEmpty } from 'lodash';

import { SupportedChainId as NetworkId, SupportedChainId, ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO } from './chain';
import Airdrip from './contracts/Airdrip';
import BALN from './contracts/BALN';
import Band from './contracts/Band';
import bnUSD from './contracts/bnUSD';
import CFT from './contracts/CFT';
import { Contract } from './contracts/contract';
import DAOFund from './contracts/DAOFund';
import Dex from './contracts/Dex';
import Dividends from './contracts/Dividends';
import Governance from './contracts/Governance';
import ICX from './contracts/ICX';
import IUSDC from './contracts/IUSDC';
import IUSDT from './contracts/IUSDT';
import Loans from './contracts/Loans';
import METX from './contracts/METX';
import OMM from './contracts/OMM';
import Rebalancing from './contracts/Rebalancing';
import Rewards from './contracts/Rewards';
import sICX from './contracts/sICX';
import Staking from './contracts/Staking';
import USDS from './contracts/USDS';
import ContractSettings, { LedgerSettings } from './contractSettings';

export { SupportedChainId, ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO };

export type AccountType = string | undefined | null;
export type ResponseJsonRPCPayload = {
  id: number;
  jsonrpc: string;
  result: string;
};

export type SettingInjection = {
  account?: AccountType;
  legerSettings?: LedgerSettings;
};

const LOOP = new BigNumber('1000000000000000000');
const TEN = new BigNumber('10');
export class BalancedJs {
  contractSettings: ContractSettings;
  networkId: NetworkId;
  provider: any;

  // token contracts
  BALN: BALN;
  sICX: sICX;
  bnUSD: bnUSD;
  ICX: ICX;
  OMM: OMM;
  IUSDC: IUSDC;
  USDS: USDS;
  CFT: CFT;
  METX: METX;
  IUSDT: IUSDT;
  //
  Loans: Loans;
  Band: Band;
  Staking: Staking;
  Dex: Dex;
  Rewards: Rewards;
  Airdrip: Airdrip;
  Dividends: Dividends;
  Governance: Governance;
  Rebalancing: Rebalancing;
  DAOFund: DAOFund;

  static utils = {
    toLoop(value: BigNumber | number | string, currencyKey?: string): BigNumber {
      if (currencyKey === 'IUSDC' || currencyKey === 'IUSDT')
        return new BigNumber(value).times(new BigNumber(10).pow(6)).integerValue(BigNumber.ROUND_DOWN);
      else return new BigNumber(value).times(LOOP).integerValue(BigNumber.ROUND_DOWN);
    },
    toIcx(value: BigNumber | number | string, currencyKey?: string): BigNumber {
      if (currencyKey === 'IUSDC' || currencyKey === 'IUSDT') return new BigNumber(value).div(new BigNumber(10).pow(6));
      else return new BigNumber(value).div(LOOP);
    },
    toFormat(value: BigNumber | number | string, decimals: number = 18) {
      return new BigNumber(value).div(TEN.pow(decimals));
    },
    POOL_IDS: {
      BALNsICX: 4,
      BALNbnUSD: 3,
      sICXbnUSD: 2,
      sICXICX: 1,
    },
  };

  /**
   * Creates instances of balanced contracts based on ContractSettings.
   * Usage example:
   * import {BalancedJs} = require('BalancedJs');
   * const bnjs = new BalancedJs(); //uses default ContractSettings - use mainnet
   * @constructor
   * @param contractSettings {Partial<ContractSettings>}
   */

  constructor(contractSettings?: Partial<ContractSettings>) {
    this.contractSettings = new ContractSettings(contractSettings);
    this.networkId = this.contractSettings.networkId;
    this.provider = this.contractSettings.provider;

    // Object.keys(contracts).forEach(name => {
    //   const Contract = contracts[name];
    //   this[name] = new Contract(_contractSettings);
    // });

    // token
    this.BALN = new BALN(this.contractSettings);
    this.ICX = new ICX(this.contractSettings);
    this.bnUSD = new bnUSD(this.contractSettings);
    this.sICX = new sICX(this.contractSettings);
    this.OMM = new OMM(this.contractSettings);
    this.IUSDC = new IUSDC(this.contractSettings);
    this.USDS = new USDS(this.contractSettings);
    this.CFT = new CFT(this.contractSettings);
    this.METX = new METX(this.contractSettings);
    this.IUSDT = new IUSDT(this.contractSettings);

    this.Loans = new Loans(this.contractSettings);
    this.Band = new Band(this.contractSettings);
    this.Staking = new Staking(this.contractSettings);
    this.Dex = new Dex(this.contractSettings);
    this.Rewards = new Rewards(this.contractSettings);
    this.Airdrip = new Airdrip(this.contractSettings);
    this.Dividends = new Dividends(this.contractSettings);
    this.Governance = new Governance(this.contractSettings);
    this.Rebalancing = new Rebalancing(this.contractSettings);
    this.DAOFund = new DAOFund(this.contractSettings);
  }

  inject({ account, legerSettings }: SettingInjection) {
    this.contractSettings.account = account || this.contractSettings.account;
    this.contractSettings.ledgerSettings.transport =
      legerSettings?.transport || this.contractSettings.ledgerSettings.transport;
    this.contractSettings.ledgerSettings.actived = !isEmpty(this.contractSettings.ledgerSettings.transport);
    this.contractSettings.ledgerSettings.path = legerSettings?.path || this.contractSettings.ledgerSettings.path;
    return this;
  }

  transfer(to: string, value: BigNumber): Promise<any> {
    const contract = new Contract(this.contractSettings);
    contract.address = to;
    const payload = contract.transferICXParamsBuilder({
      value,
    });

    return contract.callICONPlugins(payload);
  }
}
