import { compose } from 'redux';
import { createSelector } from 'reselect';

export const versionsSelector = state => state.versions;
export const localVersionsSelector = compose(
  state => state.local,
  versionsSelector
);

export const onlineVersionsSelector = compose(
  state => state.online,
  versionsSelector
);

export const allVersionsSelected = createSelector(
  localVersionsSelector,
  versions => versions.every(v => v.selected)
);
