// router
import { Router } from '@reach/router';
import styled from 'styled-components/macro';

// components
import AvatarMenu from './AvatarMenu';
import Dashboard from './Dashboard';
import ImportSpotifyHistory from './ImportSpotifyHistory';

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

const MainPage = () => (
  <HistoryProvider>
    <Page>
      <AvatarMenu />
      <Router primary={false}>
        <ScrollToTopGlobal path='/'>
          <Dashboard path='/' />
          <ImportSpotifyHistory path='import' />
        </ScrollToTopGlobal>
      </Router>
    </Page>
  </HistoryProvider>
);

export default MainPage;
