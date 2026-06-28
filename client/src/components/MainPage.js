// router
import { Router } from '@reach/router';
import styled from 'styled-components/macro';

// components
import AvatarMenu from './AvatarMenu';
import Dashboard from './Dashboard';
import CompareMusicTastes from './CompareMusicTastes';

// control behavior
import ScrollToTopGlobal from './ScrollToTopGlobal';


/////////////////////////////////////////////////////
// Pink base so the page never shows white below the last (pink) section.
const Page = styled.div`
  min-height: 100vh;
  background-color: #F67197;
`;

const MainPage = () => (
  <Page>
    <AvatarMenu />
    <Router primary={false}>
      <ScrollToTopGlobal path='/'>
        <Dashboard path='/' />
        <CompareMusicTastes path='compare' />
      </ScrollToTopGlobal>
    </Router>
  </Page>
);

export default MainPage;
