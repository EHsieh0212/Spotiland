// router
import { Router } from '@reach/router';
import styled from 'styled-components/macro';

// components
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';

// data provider — makes imported (or demo) streaming history available app-wide
import { HistoryProvider } from '../data/HistoryContext';

// control behavior
import ScrollToTopGlobal from './ScrollToTopGlobal';


/////////////////////////////////////////////////////
// Pink base so the page never shows white below the last (pink) section.
const Page = styled.div`
  min-height: 100vh;
  background-color: #F67197;
`;

// Flow: "/" is the import landing (Spotiland + import card); a successful import
// navigates to "/dashboard", which renders the charts from the imported history.
const MainPage = () => (
  <HistoryProvider>
    <Page>
      <Router primary={false}>
        <ScrollToTopGlobal path='/'>
          <LoginScreen path='/' />
          <Dashboard path='dashboard' />
        </ScrollToTopGlobal>
      </Router>
    </Page>
  </HistoryProvider>
);

export default MainPage;
