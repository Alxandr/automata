import { createSelector } from 'reselect';
import { forWindow } from '@shared/utils';

export const windowDataSelector = forWindow(state => state.window);
export const formStateSelector = forWindow(state => state.form);

export const windowSelector = createSelector(
  windowDataSelector,
  ({ module }) => module
);

export const lockedSelector = createSelector(
  windowDataSelector,
  ({ locked }) => locked
);
