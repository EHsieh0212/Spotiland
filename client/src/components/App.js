import React from 'react';
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
// The dashboard is fully self-service: it runs on imported (or demo) streaming
// history plus app-level artwork enrichment, so there is no login wall — anyone
// can land straight on it and import their own data.
const App = () => (
  <AppContainer>
    <GlobalStyle />
    <MainPage />
  </AppContainer>
);

export default App;
