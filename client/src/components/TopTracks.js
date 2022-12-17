import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getUserInfo } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';


/////////////////////////////////
// styled components
const Infos = styled.div`
  margin-bottom: 10px;
  /* color: ${colors.black}; */
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
            {
                topTracks && (<Infos> {JSON.stringify(topTracks.items[0])} </Infos>)
            }
        </Main>

    )

};


export default TopTracks;
