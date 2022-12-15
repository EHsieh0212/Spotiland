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
// styled components
const TrackInfo = styled.div`
    font-size: 30px;
    font-weight: 700;
`;
const Infos = styled.div`
  margin-bottom: 10px;
  color: ${colors.black};
  font-size: 15px;
  letter-spacing: 1px;
`;


/////////////////////////////////
// main component
const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { topTracks } = await getUserInfo();
            setTopTracks(topTracks);
            console.log(topTracks.items)
        };
        catchErrors(fetchData());
    }, []);



    return (
        <Main>
            <h1>
                Top Tracks
            </h1>
            {/* 用map的方法把圖片顯示出來 */}
            {
                
                topTracks && (<Infos> {JSON.stringify(topTracks.items[0])} </Infos>)
            }
        </Main>

    )

};


export default TopTracks;
