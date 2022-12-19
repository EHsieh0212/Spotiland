import React, { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { theme, Main } from '../styles';
const { colors, fontSizes, spacing } = theme;
// utils
import { getUserInfo, logout } from '../spotify';
// other components
import Loader from './Loader';
import TopTracks from './TopTracks';
import TopSingers from './TopSingers';
// higher order error handler
import {catchErrors} from '../utils/index'

import { keyframes } from "styled-components";


/////////////////////////////////////////////
// styled components
const hue = keyframes`
 from {
   -webkit-filter: hue-rotate(0deg);
 }
 to {
   -webkit-filter: hue-rotate(-360deg);
 }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
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
`;

const Name = styled.h1`
  font-size: 60px;
  font-weight: 700;
  margin: 20px 0 0;
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

const Info = styled.div`
  margin-top: 40px;
  text-align: center;
  font-weight: 700;
`;
const Infos = styled.div`
  margin-bottom: 10px;
  color: ${colors.black};
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;



/////////////////////////////////////////////
// Main User Components
const Dashboard = () => {

  // useState()
  const [user, setUser] = useState(null);


  // useEffect()
  useEffect(() => {
    const fetchDashboardData = async() => {
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
            <Avatar>
              {user.images.length > 0 ? (
                <img src={user.images[0].url} alt="avatar" />
              ) : (
                <NoAvatar>
                </NoAvatar>
              )}
            </Avatar>
            <UserName href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <Name>{user.display_name}</Name>
            </UserName>
            <LogoutButton onClick={logout}>Logout</LogoutButton>

            {/* {user && (
              <Info>
                User Email: <Infos> {user.email} </Infos>
                User Status: <Infos> {user.product} </Infos>
                How Many Followers: <Infos> {user.followers.total} people</Infos>
              </Info>
            )} */}
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
