import React, { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import { compose, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import classNames from 'classnames';
import { removeInvalid, withClasses, withStyleSheet } from '@styles/styled';
import { push as routerPush, replace as routerReplace } from '@shared/router';

const background = '#3c3f41';
const hoverBackground = '#1d1d1d';

const icon = (name) => ({
  '&::before': {
    'content': getIcon(name)
  }
});

const styleSheet = createStyleSheet('NavSidebar', () => ({
  sidebar: {
    'background': background,
    'border-collapse': 'separate',
    'text-align': 'left',
    'list-style': 'none inside none',
    'margin': 0,
    'padding': 0,
    'position': 'relative',
    'width': '100%',
    'min-height': '100%',

    '& li': {
      'display': 'block',
      'float': 'none',
      'position': 'relative',

      '&$title': {
        '&::first-child': {
          'margin': 0,
          'border-top-width': 0
        },
        'background': '#303234',
        'color': '#cccccc',
        'font-size': '12px',
        'line-height': '14px',
        'padding': '4px 8px',
        'border': 0
      },

      '& $link': {
        'background': background,
        'color': '#ffffff',
        'font-size': '.875rem',
        'display': 'block',
        'float': 'none',
        'padding': '.75rem 2rem .75rem 2.5rem',
        'text-decoration': 'none',
        'vertical-align': 'middle',
        'position': 'relative',
        'white-space': 'nowrap',
        'min-width': '12.5rem',
        'border': 'none',
        'border-right-style': 'solid',
        'border-right-width': '6px',
        'border-right-color': 'transparent',
        'cursor': 'pointer',
        '&:hover': {
          'background': hoverBackground
        },

        '&$active': {
          'border-right-color': '#ddd'
        },

        '& $icon': {
          'position': 'absolute',
          'left': '.875rem',
          'top': '50%',
          'margin-top': '-0.5625rem',
          'max-height': '1.125rem',
          'font-size': '1.125rem',
          'display': 'inline-block',
          'margin-right': '.3125rem',
          'vertical-align': 'middle',
          'text-align': 'center'
        }
      }
    }
  },

  title: {},
  link: {},
  active: {},

  icon: {
    'display': 'inline-block',
    'font': 'normal normal normal 1.2em/1 metro',
    'text-rendering': 'auto',
    '-webkit-font-smoothing': 'antialiased',
    'vertical-align': 'middle'
  },

  'icon-tags': icon('tags'),
  'icon-download2': icon('download2')
}));

const Sidebar =
  compose(
    setDisplayName('Sidebar'),
    withStyleSheet(styleSheet),
    withClasses('sidebar'),
    removeInvalid()
  )('ul');

const mapDispatchToNavItemProps = (dispatch, { replace, path }) => ({
  go: () => dispatch(replace ? routerPush(path) : routerReplace(path))
});
const NavItem =
  compose(
    setDisplayName('NavItem'),
    withStyleSheet(styleSheet),
    withClasses('link'),
    connect(null, mapDispatchToNavItemProps)
  )(({ path, exact, children, go, className, classes }) => (
    <li>
      <Route path={path} exact={exact} children={({ match }) => (
        <span className={classNames(className, { [classes.active]: match })} onClick={go}>{children}</span>
      )} />
    </li>
  ));
NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool
};

const getIcon = (icon) => {
  switch (icon) {
    case 'tags': return '"\\e936"';
    case 'download2': return '"\\e9c7"';
    default: throw new Error(`Icon ${icon} not suppored.`);
  }
};

const Icon =
  compose(
    setDisplayName('Icon'),
    withStyleSheet(styleSheet),
    withClasses('icon', ({ icon }) => `icon-${icon}`),
    removeInvalid()
  )('span');
Icon.propTypes = {
  icon: PropTypes.string.isRequired
};

const NavSidebar = () => (
  <Sidebar>
    <NavItem exact path="/"><Icon icon="tags" />Instances</NavItem>
    <NavItem path="/versions"><Icon icon="download2" />Versions</NavItem>
  </Sidebar>
);

export default NavSidebar;
