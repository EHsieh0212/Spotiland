import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
// css
import styled from 'styled-components/macro';
import { theme, mixins, media, Main } from '../styles';
const { colors, fontSizes, spacing } = theme;
// utils
import { getUserInfo, logout } from '../spotify';
import { catchErrors } from '../utils';
// other components
import Loader from './Loader';
import TopTracks from './TopTracks';
import TopSingers from './TopSingers';


/////////////////////////////////////////////
// styled components
const Header = styled.header`
  ${mixins.flexCenter};
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
  ${media.tablet`
    font-size: 40px;
  `};
  ${media.phablet`
    font-size: 8vw;
  `};
`;
const LogoutButton = styled.a`
  background-color: transparent;
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
    background-color: ${colors.white};
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
const User = () => {
  const [user, setUser] = useState(null);
  const [followedArtists, setFollowedArtists] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    // 1.
    const fetchData = async () => {
      const { user, followedArtists, playlists, topArtists, topTracks } = await getUserInfo();
      console.log('===========')

      console.log(topTracks.items[0])
      setUser(user);
      setFollowedArtists(followedArtists);
      setPlaylists(playlists);
      setTopArtists(topArtists);
      setTopTracks(topTracks);
    };
    // 2.
    catchErrors(fetchData());
  }, []);


  //////////////////////////////////////////////
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

            {user && playlists && (
              <Info>
                User Email: <Infos> {user.email} </Infos>
                User Status: <Infos> {user.product} </Infos>
                How Many Followers: <Infos> {user.followers.total} people</Infos>
                How Many Tracks: <Infos> {playlists.total} tracks</Infos>
              </Info>
            )}
          </Header>
              <TopTracks />
              <TopSingers />
        </Main>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default User;
