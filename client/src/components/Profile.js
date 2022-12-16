import React from 'react';
import Nav from './Nav';
import User from './User';

// setting up routes



const Profile = () => (
  <div>
    <Nav />
    <User path="/" />
  </div>
);

export default Profile;
