import React, { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { theme } from '../styles';
const { colors, fontSizes, spacing } = theme;
// utils
import { getUserInfo, logout } from '../spotify';
// other components
import Loader from './Loader';
import TopTracks from './TopTracks';
import TopSingers from './TopSingers';
// higher order error handler
import { catchErrors } from '../utils/index'


/////////////////////////////////////////////
// styled components

const Main = styled.main`
  width: 100%;
  max-width: 1950px;
  margin-top: 20px;
  padding: 0 0 0 50px;
`;


const Header = styled.header`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-left: 500px;
  margin-right: 500px;
  padding-bottom: 0px;
`;

const PersonalInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Avatar = styled.div`
  margin: 0;
  width: 200px;
  height: 200px;
  img {
    border-radius: 100%;
  }
`;

const NoAvatar = styled.div`
  border: 2px solid currentColor;
  border-radius: 100%;
  padding: ${spacing.md};
`;

const UserName = styled.a`
  &:hover,
  &:focus {
    color: ${colors.offGreen};
  }
  h1{
    font-size: 60px;
    font-weight: 700;
    margin: 20px 0 0;
  }
`;

const LogoutButton = styled.a`
  background-color: black;
  color: ${colors.white};

  border: 1px solid ${colors.white};
  border-radius: 30px;
  margin-top: 30px;
  padding: 12px 30px;

  font-size: ${fontSizes.xs};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;

  &:hover,
  &:focus {
    background-color: ${colors.green};
    color: ${colors.black};
  }
`;


const RoadSigns = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 70px;
  .infos-top, .infos-middle, .infos-bottom{
    font-size: 35px;
    font-weight: 800;
    margin-bottom: 19px;
    text-transform: uppercase;
    text-decoration: underline;
  };
`;



/////////////////////////////////////////////
// Main User Components
const Dashboard = () => {

  // useState()
  const [user, setUser] = useState(null);


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
          <Header>
            <PersonalInfo>
              <Avatar>
                {user.images.length > 0 ? (
                  <img src={user.images[0].url} alt="avatar" />
                ) : (
                  <NoAvatar>
                  </NoAvatar>
                )}
              </Avatar>
              <UserName href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <h1>{user.display_name}</h1>
              </UserName>
              <LogoutButton onClick={logout}>Logout</LogoutButton>
            </PersonalInfo>
            <RoadSigns>
              <a className='infos-top' href='/'> Top Singers </a>
              <a className='infos-middle' href='/'> Top Tracks </a>
            </RoadSigns>
          </Header>

          <TopSingers />
          <TopTracks />
        </Main>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
