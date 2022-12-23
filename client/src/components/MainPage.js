// router
import { Router } from '@reach/router';

// components
import Nav from './Nav';
import Dashboard from './Dashboard';
import LyricGenerator from './LyricGenerator';
import Kareoke from './Kareoke';

// control behavior
import ScrollToTheTop from './ScrollToTheTop';


/////////////////////////////////////////////////////
const MainPage = () => (
  <div>
    <Nav />
    <Router primary={false}>
      <ScrollToTheTop path='/'>
        <Dashboard path='/' />
        <LyricGenerator path='/lyricGenerator' />
        <Kareoke path='/kareoke' />
      </ScrollToTheTop>
    </Router>
  </div>
);

export default MainPage;