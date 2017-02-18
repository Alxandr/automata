import React, { PropTypes } from 'react';
import { styled } from 'styletron-react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { push as routerPush, replace as routerReplace } from '../../../router';

/*const NavSidebar = () => (
  <Sidebar colorIndex="neutral-1" fixed={true}>
    <Header size="large" justify="between" pad={{ horizontal: 'medium' }}>
      <Title>Automata</Title>
    </Header>
    <Menu fill={true} primary={true}>
      <Anchor path="/index" label="Instances" replace={true} />
      <Anchor path="/versions" label="Factorio Versions" replace={true} />
    </Menu>
    <Footer pad={{ horizontal: 'medium', vertical: 'small' }}>
      Version: 0.1.0
    </Footer>
  </Sidebar>
);*/
const background = '#3c3f41';
const activeBackground = '#0f1316';
const hoverBackground = '#1d1d1d';

const Sidebar = styled('ul', {
  'background': background,
  'border-collapse': 'separate',
  'text-align': 'left',
  'list-style': 'none inside none',
  'margin': 0,
  'padding': 0,
  'position': 'relative',
  'width': '100%',
  'min-height': '100%'
});

const SidebarItem = styled('li', {
  'display': 'block',
  'float': 'none',
  'position': 'relative'
});

const Title = styled(SidebarItem, {
  ':first-child': {
    'margin': 0,
    'border-top-width': 0
  },
  'background': '#303234',
  'color': '#cccccc',
  'font-size': '12px',
  'line-height': '14px',
  'padding': '4px 8px',
  'border': 0
});

const NavItemLink = styled('span', ({ active }) => ({
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
  'border-right-color': active ? '#ddd' : 'transparent',
  'cursor': 'pointer',
  ':hover': {
    'background': hoverBackground
  }
}));

const mapDispatchToNavItemProps = (dispatch, { replace, path }) => ({
  go: () => dispatch(replace ? routerPush(path) : routerReplace(path))
});
const NavItem = connect(null, mapDispatchToNavItemProps)(({ path, exact, children, go }) => (
  <Route path={path} exact={exact} children={({ match }) => (
    <NavItemLink active={match ? true : false} onClick={go}>{children}</NavItemLink>
  )} />
));

const getIcon = (icon) => {
  switch (icon) {
    case 'tags': return '\ue936';
    case 'download2': return '\ue9c7';
    default: throw new Error(`Icon ${icon} not suppored.`);
  }
};

const IconSpan = styled('span', {
  'display': 'inline-block',
  'font': 'normal normal normal 1.2em/1 metro',
  'text-rendering': 'auto',
  '-webkit-font-smoothing': 'antialiased',
  'vertical-align': 'middle'
});

const Icon = ({ icon, className }) => <IconSpan className={className}>{getIcon(icon)}</IconSpan>;
Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
};

const NavIcon = styled(Icon, {
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
});

const NavSidebar = () => (
  <Sidebar>
    <NavItem path="/index"><NavIcon icon="tags" />Instances</NavItem>
    <NavItem path="/versions"><NavIcon icon="download2" />Versions</NavItem>
  </Sidebar>
);

export default NavSidebar;
