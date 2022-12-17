import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
// higher order error handler
import { catchErrors } from '../utils/index'
// css
import { Main } from '../styles';
// utils
import { getUserInfo } from '../spotify';


/////////////////////////////////////////////
// styled components
const Title = styled.div`
        display: flex;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    font-family: 'Courier New', Courier, monospace;
`;


/////////////////////////////////////////////
// main component


const Kareoke = () => {
    // use state
    const [kareoke, setKareoke] = useState(null);

    // use effect
    useEffect(() => {
        const tmp = async() => {
            const { user, playlists } = await getUserInfo();
            setKareoke(user);
        };
        catchErrors(tmp());
    }, []);

    // jsx
    return (
        <React.Fragment>
            <Main>
                <Title>
                    Kareoke
                </Title>
                <Title>
                    Lyric
                </Title>
                <Title>
                    Lyric 
                </Title>
                <Title>
                    Lyric 
                </Title>
                <Title>
                    Lyric 
                </Title>
                <Title>
                    Lyric 
                </Title>
                <Title>
                    Lyric
                </Title>
                <Title>
                    Lyric 
                </Title>
                <Title>
                    L
                </Title>
                <Title>
                    L
                </Title>
                <Title>
                    L
                </Title>
            </Main>
        </React.Fragment>
    );
};

export default Kareoke;
