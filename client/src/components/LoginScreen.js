import React from 'react';
import styled from 'styled-components/macro';
import { theme, Main } from '../styles';
const { colors } = theme;
import Footer from './Footer';


const LOGIN_URI = '/login'


///////////////////////////////////////////////
// styled components
const Login = styled(Main)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.black};
  flex-direction: column;
  min-height: 100vh;
  h1 {
    font-size: 100px;
  }
`;
const LoginButton = styled.a`
  display: inline-block;
  background-color: ${colors.black};
  color: ${colors.white};
  border-radius: 30px;
  padding: 17px 35px;
  margin: 20px 0 70px;
  min-width: 160px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.green};
  }
`;


///////////////////////////////////////////////
// Login JSX
const LoginScreen = () => (
  <Login>
    <h1>Spotiland</h1>
    <LoginButton href={LOGIN_URI}> Log in to Spotify </LoginButton>
    <Footer />
  </Login>

);

export default LoginScreen;
