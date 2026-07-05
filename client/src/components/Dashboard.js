import React, { useState, useEffect, useRef } from 'react';
// css
import styled from 'styled-components/macro';
// utils
import { getUserInfo } from '../spotify';
// other components
import Loader from './Loader';
// TopSingers / TopTracks are now superseded by MonthlyTops (per-month charts).
// import TopTracks from './TopTracks';
// import TopSingers from './TopSingers';
import MonthlyTops from './MonthlyTops';
import TopGenres from './TopGenres';
import ListeningClock from './ListeningClock';
// higher order error handler
import { catchErrors } from '../utils';
import ScrollToTopDashboard from './ScrollToTopDashboard';


/////////////////////////////////////////////
// styled components
const Main = styled.main`
  width: 100%;
`;


/////////////////////////////////////////////
// Main User Components
const Dashboard = () => {

  // useState() — `user` only gates the initial Loader; each section fetches its own top data.
  const [user, setUser] = useState(null);
  // const topSingers = useRef(null);
  // const topTracks = useRef(null);
  const monthlyTops = useRef(null);
  const topGenres = useRef(null);
  const listeningClock = useRef(null);

  // useEffect()
  useEffect(() => {
    const fetchDashboardData = async () => {
      const { user } = await getUserInfo();
      setUser(user);
    }
    catchErrors(fetchDashboardData());
  }, []);


  // JSX
  return (
    <React.Fragment>
      {user ? (
        <Main>
          <ScrollToTopDashboard />
          {/* <TopSingers refPlace={topSingers}/> */}
          {/* <TopTracks refPlace={topTracks}/> */}
          <MonthlyTops refPlace={monthlyTops}/>
          <TopGenres refPlace={topGenres}/>
          <ListeningClock refPlace={listeningClock}/>
        </Main>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
