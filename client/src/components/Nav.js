import React from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components/macro';
import { theme, mixins } from '../styles';
const { colors } = theme;

// import routing packages
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// nav bar總共有五大元件：container, menu, menuitem, navlink, github-link

///////////////////////////////////////////////
// styled components
const Container = styled.nav`
  ${mixins.coverShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: ${theme.navWidth};
  background-color: #57575E;
  text-align: center;
  z-index: 99;
`;

const Menu = styled.ul`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
`;
const MenuItem = styled.li`
  margin-top: 30px;
  color: ${colors.lightGrey};
  font-size: 16px;
  a {
    display: block;
    padding: 15px 0;
    border-left: 5px solid transparent;
    width: 100%;
    height: 100%;
    &:hover,
    &:focus,
    &.active {
      color: ${colors.white};
      background-color: ${colors.black};
      border-left: 8px solid ${colors.offGreen};
    }
  }
  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 7px;
  }
`;

// ref: https://reach.tech/router/api/Link
const isActive = ({ isCurrent }) => (isCurrent ? { className: 'active' } : null);
const NavLink = props => <Link getProps={isActive} {...props} />;




///////////////////////////////////////////////
// Login JSX
const Nav = () => (
  <Container>
    <Menu>
      <MenuItem>
        <NavLink to="/">
          <div>Dashboard</div>
        </NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink to="/lyricGenerator">
          <div>Lyric Generator</div>
        </NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink to="/kareoke">
          <div>Personal Kareoke Room</div>
        </NavLink>
      </MenuItem>
    </Menu>
  </Container>
);

export default Nav;
