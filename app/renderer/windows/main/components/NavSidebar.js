import React, { PropTypes } from 'react';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import Anchor from '../../../grommet-override/components/Anchor';

const NavSidebar = () => (
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
);

export default NavSidebar;
