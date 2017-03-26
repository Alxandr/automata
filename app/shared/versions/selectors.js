import { compose } from 'redux';

export const versionsSelector = state => state.versions;
export const localVersionsSelector = compose(
  state => state.local,
  versionsSelector
);

export const onlineVersionsSelector = compose(
  state => state.online,
  versionsSelector
);
