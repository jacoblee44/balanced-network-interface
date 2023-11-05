import { createReducer } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { SUPPORTED_PAIRS, Pair } from 'constants/currency';
import { Pool } from 'types';

import { setPair, setPoolData, setBalance, clearBalances } from './actions';

export interface Balance {
  baseCurrencyKey: string;
  quoteCurrencyKey: string;
  balance: BigNumber;
  balance1?: BigNumber;
}

export interface PoolState {
  selectedPair: Pair;

  pools: {
    [poolId: string]: Pool;
  };

  balances: {
    [poolId: string]: Balance;
  };
}

const initialState: PoolState = {
  selectedPair: SUPPORTED_PAIRS[0],
  pools: {},
  balances: {},
};

export default createReducer(initialState, builder =>
  builder
    .addCase(setPair, (state, { payload }) => {
      state.selectedPair = payload;
    })
    .addCase(setPoolData, (state, { payload }) => {
      const { poolId, poolData } = payload;
      state.pools = {
        ...state.pools,
        [poolId]: {
          ...state.pools[poolId],
          ...poolData,
        },
      };
    })
    .addCase(setBalance, (state, { payload }) => {
      const { poolId, balance } = payload;
      state.balances = {
        ...state.balances,
        [poolId]: balance,
      };
    })
    .addCase(clearBalances, (state, { payload }) => {
      state.balances = {};
    }),
);
