import { createSelector } from 'reselect';

const stateSelector = state => state.login;

export const isLoggedInSelector =
  createSelector(
    stateSelector,
    ({ cookies }) => cookies !== null
  );
