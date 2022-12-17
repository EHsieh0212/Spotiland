import React, { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { theme, Main } from '../styles';
const { colors } = theme;
// fetch functions
import { getUserInfo } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';


/////////////////////////////////
// styled component
const Infos = styled.div`
  margin-bottom: 10px;
  color: ${colors.black};
  font-size: 15px;
  letter-spacing: 1px;
`;



/////////////////////////////////
// main component
const TopSingers = () => {
    // use state
    const [topSingers, setTopSingers] = useState(null);


    
    // use effect
    useEffect(() => {
        const fetchData = async () => {
            const { topArtists } = await getUserInfo();
            setTopSingers(topArtists);
        };
        catchErrors(fetchData());
    }, []);



    // jsx
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
