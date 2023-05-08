// router
import { Router } from '@reach/router';

// components
import Nav from './Nav';
import Dashboard from './Dashboard';
import LyricGenerator from './LyricGenerator';

// control behavior
import ScrollToTopGlobal from './ScrollToTopGlobal';


/////////////////////////////////////////////////////
const MainPage = () => (
  <div>
    {/* <Nav /> */}
    <Router primary={false}>
      <ScrollToTopGlobal path='/'>
        <Dashboard path='/' />
        {/* <LyricGenerator path='/lyricGenerator' /> */}
      </ScrollToTopGlobal>
    </Router>
  </div>
);

export default MainPage;