import { useState, useEffect, useRef } from 'react';
// router
import { navigate } from '@reach/router';
// css
import styled from 'styled-components/macro';
import { theme } from '../styles';
const { colors, fontSizes } = theme;
// utils
import { getUser, logout } from '../spotify';
import { catchErrors } from '../utils';


/////////////////////////////////////////////
// styled components
const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

// Wraps the button so the sound-wave ripples can expand beyond the avatar
// (the button itself clips its content with overflow: hidden).
const AvatarBox = styled.div`
  position: relative;
  width: 48px;
  height: 48px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid ${colors.white};
    opacity: 0;
    pointer-events: none;
  }
  &:hover::before,
  &:hover::after {
    animation: avatarRipple 1.8s ease-out infinite;
  }
  &:hover::after {
    animation-delay: 0.9s;
  }

  @keyframes avatarRipple {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 2px solid ${colors.white};
  border-radius: 50%;
  background-color: ${colors.darkGrey};
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NoAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${colors.grey};
`;

const Menu = styled.ul`
  position: absolute;
  top: 60px;
  right: 0;
  min-width: 210px;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background-color: ${colors.black};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

const UserNameItem = styled.li`
  padding: 10px 20px;
  border-bottom: 1px solid ${colors.grey};
  color: ${colors.lightestGrey};
  font-size: ${fontSizes.sm};
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuItem = styled.li`
  button {
    display: block;
    width: 100%;
    padding: 12px 20px;
    border: none;
    background: none;
    color: ${colors.white};
    font-size: ${fontSizes.sm};
    text-align: left;
    cursor: pointer;
  }
`;


/////////////////////////////////////////////
// Floating top-right avatar with a dropdown menu (navigation + logout).
const AvatarMenu = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fetch the current user's profile (used only for the avatar image / name).
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getUser();
      setUser(data);
    };
    catchErrors(fetchUser());
  }, []);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  const avatarUrl =
    user && user.images && user.images.length > 0 ? user.images[0].url : null;

  return (
    <Wrapper ref={ref}>
      <AvatarBox>
        <AvatarButton onClick={() => setOpen((prev) => !prev)} aria-label="Open menu">
          {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : <NoAvatar />}
        </AvatarButton>
      </AvatarBox>
      {open && (
        <Menu>
          {user && user.display_name && <UserNameItem>{user.display_name}</UserNameItem>}
          <MenuItem>
            <button onClick={() => go('/')}>Personal Analysis</button>
          </MenuItem>
          <MenuItem>
            <button onClick={() => go('/import')}>Import Spotify History</button>
          </MenuItem>
          <MenuItem>
            <button onClick={logout}>Logout</button>
          </MenuItem>
        </Menu>
      )}
    </Wrapper>
  );
};

export default AvatarMenu;
