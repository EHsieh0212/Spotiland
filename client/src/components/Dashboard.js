import React, { useState, useEffect, useRef } from 'react';
// css
import styled from 'styled-components/macro';
// utils
import { getUserInfo } from '../spotify';
// other components
import Loader from './Loader';
import TopTracks from './TopTracks';
import TopSingers from './TopSingers';
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
  const topSingers = useRef(null);
  const topTracks = useRef(null);

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
          <TopSingers refPlace={topSingers}/>
          <TopTracks refPlace={topTracks}/>
        </Main>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
