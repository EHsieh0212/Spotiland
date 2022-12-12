import React, { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { theme, mixins, media, Main } from '../styles';
const { colors, fontSizes, spacing } = theme;
// utils
import { getUserInfo, logout } from '../spotify';
import { catchErrors } from '../utils';
// other components
import Loader from './Loader';






/////////////////////////////////
// main component
const TopSingers = () => (
    <Main>
        <h1>
            Top Singers
        </h1>
    </Main>
);

export default TopSingers;
