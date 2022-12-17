import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../spotify';
import LoginScreen from './LoginScreen';
import MainPage from './MainPage';
import styled from 'styled-components/macro';
import { GlobalStyle } from '../styles';


///////////////////////////////////////////////
// styled components
const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;


///////////////////////////////////////////////
// Login JSX
const App = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);
  }, []);

  return (
    <AppContainer>
      <GlobalStyle />
      {accessToken ? <MainPage /> : <LoginScreen />}
    </AppContainer>
  );
};

export default App;
