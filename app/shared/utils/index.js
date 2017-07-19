import slug from 'slug';

slug.defaults.modes.pretty.lower = true;
slug.defaults.modes.pretty.remove = null;

export { slug };
export { default as perWindow } from './perWindow';
export { default as forWindow } from './forWindow';
export { default as remove } from './remove';
