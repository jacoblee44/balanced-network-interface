import { createAction } from '@reduxjs/toolkit';

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const COMMON_PERCENTS = [25, 50, 75, 100];

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency');
export const selectPercent = createAction<{ field: Field; percent: number; value: string }>('swap/selectPercent');
export const switchCurrencies = createAction<void>('swap/switchCurrencies');
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput');
export const replaceSwapState = createAction<{
  field: Field;
  typedValue: string;
  inputCurrencyId?: string;
  outputCurrencyId?: string;
  recipient: string | null;
}>('swap/replaceSwapState');
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient');
