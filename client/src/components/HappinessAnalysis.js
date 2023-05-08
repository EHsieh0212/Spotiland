import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Main } from '../styles';
import HappinessTrackList from './HappinessTrackList'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CiCircleQuestion } from "react-icons/ci";
import { getTopTracks100, getTrackInfo, createPlaylist} from "../spotify";
import Loader from './Loader';
import { catchErrors } from '../utils';




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
    margin-top: 100px;
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
    margin-right: 85px;
    padding-bottom: 150px;
    /* background-color: pink; */
    justify-content: center;
    align-items: center;
`;


const Saddness = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 85px;
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
/////////////////////////////
const ColorTabs = () => {
    const [tabvalue, setTabValue] = useState('Your Analysis');

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    return (
        <Box sx={{ width: '100%', opacity: '0.8' }}>
            <Tabs
                value={tabvalue}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="Your Analysis" label="Your Analysis" />
                <Tab value="Recommendation" label="Recommendation" />
            </Tabs>
        </Box>
    );
}



////////////////////////////
// main component
const HappinessAnalysis = ({ refPlace }) => {
    const [happySongs, setHappySongs] = useState(null);
    const [sadSongs, setSadSongs] = useState(null);
    const [happyaudioFeatures, setHappyAudioFeatures] = useState(null);
    const [sadaudioFeatures, setSadAudioFeatures] = useState(null);

    const fetchData = async() => {
        


    };

    const retrieveData = () => catchErrors(fetchData());


    useEffect(() => {


    }, [])





    //////////////////////////////////////////////
    // jsx
    return (
        <Main>
            <Body>
                <FrontIntro>
                    <Title id='happiness' ref={refPlace}>
                        How Happy Are Your Favorite Songs?
                    </Title>
                    <Description>
                        Accoring to Spotify API calculation {<CiCircleQuestion />}, the average happiness level of songs that Taiwanese people are hearing is 49%.
                    </Description>
                    <Description>
                        Therefore, based on this number, we've calculated and gathered your happiness songs.
                    </Description>
                    <Description>
                        Based on the historical data, we've also recommend several songs for you. 
                    </Description>
                </FrontIntro>

                <BigSection>
                    <Section>
                        <ExtremeHappy>
                            <Intro> Extremely Happy Section! &#128512; </Intro>
                            <List>
                                <ColorTabs />
                            </List>
                            <List>
                                <HappinessTrackList />
                            </List>
                            <CreatePlaylist>Create Playlist</CreatePlaylist>
                        </ExtremeHappy>

                        <Saddness>
                            <Intro> These Are Your Favorite Songs That Are Really Sad &#127783; </Intro>
                            <List>
                                <ColorTabs />
                            </List>
                            <List>
                                <HappinessTrackList />
                            </List>
                            <CreatePlaylist>Create Playlist</CreatePlaylist>
                        </Saddness>

                    </Section>
                </BigSection>
                asdfsdfasdf

            </Body>

        </Main>
    );
};

export default HappinessAnalysis;
