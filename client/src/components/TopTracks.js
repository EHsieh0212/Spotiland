import React, { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { theme, Main } from '../styles';
const { colors } = theme;
// fetch function
import { getUserInfo } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';


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
