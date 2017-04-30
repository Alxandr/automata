import {
  CREATE_INSTANCE,
  FETCH_INSTANCES,
  SET_INSTANCES,
  START,
} from './constants';

export const fetchLocalInstances = () => ({
  type: FETCH_INSTANCES
});

export const setInstances = instances => ({
  type: SET_INSTANCES,
  payload: instances
});

export const createInstance = () => ({
  type: CREATE_INSTANCE
});

export const start = (id) => ({
  type: START,
  payload: id
});
