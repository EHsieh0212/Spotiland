import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Main } from '../styles';
import { getTopTracks100, getTrackInfo } from "../spotify";
import HappinessTrackList from './HappinessTrackList'


////////////////////////////
// styled components
const Body = styled.div`
    background-color: #E7F0F0;
    
`;

const FrontIntro = styled.div`
    padding-top: 20px;
    margin-top: 0px;
    margin-bottom: 50px;
    margin-left: 20px;
`;

const Title = styled.h1`
    font-size: 60px;
    font-weight: 900;
    color: black;
    margin-bottom: 20px;
`;

const Description = styled.div`
    display: flex;
    font-size: 20px;
`;

const BigSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 80px;
    margin-right: 180px;
    padding-bottom: 260px;
`;

const Section = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(100px, 3fr));
    width: 100%;
    text-align: center;
`;

const ExtremeHappy = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 35px;
    padding-bottom: 150px;
    /* background-color: pink; */
    justify-content: center;
    align-items: center;
`;


const Saddness = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 35px;
    /* background-color: pink; */
    justify-content: center;
    align-items: center;
    padding-bottom: 150px;
`;

const Intro = styled.div`
    font-size: 38px;
    font-weight: 700;
    margin-bottom: 40px;
    /* background-color: green; */
`;

const List = styled.div`
    display: flex;
    margin-bottom: 40px;
`;

const CreatePlaylist = styled.button`
    background-color: green;
    color: white;
    text-transform: uppercase;
    font-size: 13px;
`;



////////////////////////////
// main component
const HappinessAnalysis = ({ refPlace }) => {
    return (
        <Main>
            <Body>
                <FrontIntro>
                    <Title id='happiness' ref={refPlace}>
                        How Happy Are Your Favorite Songs?
                    </Title>
                    <Description>
                        Accoring to Spotify API calculation, the average happiness level of songs that Taiwanese people are hearing is 49%.
                        <br />
                        Therefore, based on this number, we've calculated and gathered your happiness songs.
                    </Description>
                    
                </FrontIntro>

                <BigSection>
                    <Section>
                        <ExtremeHappy>
                            <Intro> Extremely Happy Section! </Intro>
                            <List>
                                <HappinessTrackList />
                            </List>
                            {/* <CreatePlaylist>Create Playlist</CreatePlaylist> */}
                        </ExtremeHappy>

                        <Saddness>
                            <Intro> These Are Your Favorite Songs That Are Really Sad </Intro>
                            <List>
                                <HappinessTrackList />
                            </List>
                        </Saddness>

                    </Section>
                </BigSection>


            </Body>

        </Main>
    );
};

export default HappinessAnalysis;
