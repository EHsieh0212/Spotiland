import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
// higher order error handler
import { catchErrors } from '../utils/index'
// css
import { Main } from '../styles';
// utils
import { getUserInfo } from '../spotify';
import { getCrawl } from '../spotify/crawl';


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
// Main Lyric Generator Components
const LyricGenerator = () => {
    // use state
    const [lyric, setLyric] = useState(null);
    const [crawl, setCrawl] = useState(null);

    // use effect
    useEffect(() => {
        const tmp = async() => {
            const { user } = await getUserInfo();
            const a = await getCrawl();
            console.log("a")
            console.log(a)
            setLyric(user)
            setCrawl(a);
        }
        catchErrors(tmp());
    }, []);

    // jsx
    return (
        <React.Fragment>
            <Main>
                <Title>
                    Lyric Generator
                </Title>
                <Title>
                    Lyric Generator
                </Title>
                <Title>
                    Lyric Generator
                </Title>
                <Title>
                    {crawl}
                </Title>
                <Title>
                    Lyric Generator
                </Title>
                <Title>
                    Lyric Generator
                </Title>
                <Title>
                    Lyric Generator
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
            </Main>

        </React.Fragment>
    )
}

export default LyricGenerator;
