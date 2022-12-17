import React from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components/macro';
import { theme } from '../styles';
const { colors } = theme;


/////////////////////////////////////////////////
// routing設定
// ref: https://reach.tech/router/api/Link
const isActive = ({ isCurrent }) => (isCurrent ? { className: 'active' } : null);
const NavLink = props => <Link getProps={isActive} {...props} />;



///////////////////////////////////////////////
// nav bar總共有 3 大元件：container, menu, menuitem
// styled components
const Container = styled.nav`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);  
  display: flex;
    justify-content: space-between;
    align-items: center;
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: ${theme.navWidth};
  background-color: ${colors.black};
  text-align: center;
  z-index: 99;
`;

const Menu = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.li`
  margin-top: 30px;
  font-size: 16px;
  a {
    color: ${colors.white};
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
`;




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