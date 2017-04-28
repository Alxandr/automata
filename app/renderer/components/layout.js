import { compose, setDisplayName } from 'recompose';
import { removeInvalid, withClasses, withStyleSheet } from '../styles/styled';

import PropTypes from 'prop-types';
import { createStyleSheet } from 'jss-theme-reactor';

const styleSheet = createStyleSheet('Layout', () => ({
  columnLayout: {
    display: 'flex',
    flexDirection: 'row',
    wrap: 'nowrap',
    justifyContent: 'start'
  },

  item: {
    flex: 1
  },

  itemFixed: {
    extend: 'item',
    flex: 'none'
  }
}));

export const ColumnLayout =
  compose(
    setDisplayName('ColumnLayout'),
    withStyleSheet(styleSheet),
    withClasses('columnLayout'),
    removeInvalid()
  )('div');

export const Column =
  compose(
    setDisplayName('Column'),
    withStyleSheet(styleSheet),
    withClasses(({ fixed }) => fixed ? 'itemFixed' : 'item'),
    removeInvalid()
  )('div');

Column.propTypes = {
  fixed: PropTypes.bool
};
