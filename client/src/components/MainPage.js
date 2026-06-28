// router
import { Router } from '@reach/router';
import styled from 'styled-components/macro';

// components
import Nav from './Nav';
import Dashboard from './Dashboard';
import LyricGenerator from './LyricGenerator';

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
    {/* <Nav /> */}
    <Router primary={false}>
      <ScrollToTopGlobal path='/'>
        <Dashboard path='/' />
        {/* <LyricGenerator path='/lyricGenerator' /> */}
      </ScrollToTopGlobal>
    </Router>
  </Page>
);

export default MainPage;