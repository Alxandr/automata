import { compose } from 'redux';

const baseSelector = state => state.instances;

export const instancesSelector = compose(
  state => state.instances,
  baseSelector
);

export const instancesLoadedSelector = compose(
  state => state.loaded,
  baseSelector
);
