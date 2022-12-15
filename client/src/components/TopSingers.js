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


const Infos = styled.div`
  margin-bottom: 10px;
  color: ${colors.black};
  font-size: 15px;
  letter-spacing: 1px;
`;



/////////////////////////////////
// main component
const TopSingers = () => {
    const [topSingers, setTopSingers] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { topArtists } = await getUserInfo();
            setTopSingers(topArtists);
        };
        catchErrors(fetchData());
    }, []);

    return (
        <Main>
            <h1>
                Top Singers
            </h1>
            {
                topSingers && (<Infos> {JSON.stringify(topSingers.items[0])} </Infos>)
            }
        </Main>
    )
};

export default TopSingers;
