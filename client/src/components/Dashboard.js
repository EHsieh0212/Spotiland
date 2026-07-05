import React, { useRef } from 'react';
// css
import styled from 'styled-components/macro';
// other components
// TopSingers / TopTracks are now superseded by MonthlyTops (per-month charts).
// import TopTracks from './TopTracks';
// import TopSingers from './TopSingers';
import MonthlyTops from './MonthlyTops';
import TopGenres from './TopGenres';
import ListeningClock from './ListeningClock';
import ScrollToTopDashboard from './ScrollToTopDashboard';


/////////////////////////////////////////////
// styled components
const Main = styled.main`
  width: 100%;
`;


/////////////////////////////////////////////
// Main User Components
const Dashboard = () => {
  // Each section reads its data from HistoryContext (imported or demo) and
  // enriches artwork via the backend, so nothing here depends on a logged-in
  // Spotify user.
  const monthlyTops = useRef(null);
  const topGenres = useRef(null);
  const listeningClock = useRef(null);

  return (
    <Main>
      <ScrollToTopDashboard />
      <MonthlyTops refPlace={monthlyTops}/>
      <TopGenres refPlace={topGenres}/>
      <ListeningClock refPlace={listeningClock}/>
    </Main>
  );
};

export default Dashboard;
