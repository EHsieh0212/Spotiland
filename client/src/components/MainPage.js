// router
import { Router } from '@reach/router';

// components
import Dashboard from './Dashboard';

// control behavior
import ScrollToTopGlobal from './ScrollToTopGlobal';


/////////////////////////////////////////////////////
const MainPage = () => (
  <div>
    <Router primary={false}>
      <ScrollToTopGlobal path='/'>
        <Dashboard path='/' />
      </ScrollToTopGlobal>
    </Router>
  </div>
);

export default MainPage;