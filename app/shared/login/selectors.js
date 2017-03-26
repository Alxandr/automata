import { createSelector } from 'reselect';

const stateSelector = state => state.login;

export const sessionSelector =
  createSelector(
    stateSelector,
    ({ cookies }) => cookies
  );

export const isLoggedInSelector =
  createSelector(
    sessionSelector,
    session => session !== null
  );
