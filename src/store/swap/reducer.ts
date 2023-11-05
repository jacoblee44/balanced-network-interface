import { createReducer } from '@reduxjs/toolkit';

import { SUPPORTED_PAIRS } from 'constants/currency';
import { CurrencyKey } from 'types';

import {
  Field,
  replaceSwapState,
  selectCurrency,
  selectPercent,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions';

export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: CurrencyKey | undefined;
    readonly percent: number;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: CurrencyKey | undefined;
  };
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null;
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: SUPPORTED_PAIRS[2].baseCurrencyKey,
    percent: 0,
  },
  [Field.OUTPUT]: {
    currencyId: SUPPORTED_PAIRS[2].quoteCurrencyKey,
  },
  recipient: null,
};

export default createReducer<SwapState>(initialState, builder =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
            percent: 0,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue: typedValue,
          recipient,
        };
      },
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;

      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { ...state[field], currencyId: currencyId, percent: 0 },
          [otherField]: { ...state[otherField], currencyId: state[field].currencyId, percent: 0 },
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: { ...state[field], currencyId: currencyId, percent: 0 },
        };
      }
    })
    .addCase(selectPercent, (state, { payload: { percent, field, value } }) => {
      return {
        ...state,
        independentField: field,
        typedValue: value,
        [field]: { ...state[field], percent: percent },
      };
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { ...state[Field.OUTPUT], currencyId: state[Field.OUTPUT].currencyId, percent: 0 },
        [Field.OUTPUT]: { ...state[Field.INPUT], currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;

      return {
        ...state,
        independentField: field,
        typedValue,
        [field]: { ...state[field], percent: 0 },
        [otherField]: { ...state[otherField], percent: 0 },
      };
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient;
    }),
);
