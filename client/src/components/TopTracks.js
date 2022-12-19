import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getUserInfo, getTopTracksLong, getTopTracksShort } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';


/////////////////////////////////
// styled components
// 1. basics
const Body = styled.div`
    background-color: #F67197;
    margin: 0px;
    padding: 0px;
`;

const Title = styled.h1`
    padding-top: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
    font-size: 60px;
    font-weight: 900;
    color: white;
`;


// 2. track related
const TrackContainer = styled.div`
    /* background-color: yellow; */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 25px;
    margin-top: 20px;
    margin-left: 200px;
    margin-right: 200px;
    margin-bottom: 0px;
    padding-bottom: 190px;
`;

// 要先放Mask, 再放TracktInfo
const Mask = styled.div`
  /* 固定而可以成效的設定*/
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  color: white;
  font-weight: 800;
`;


const TrackInfo = styled.div`   
    display: grid;
    grid-template-columns: auto 180px;
    grid-gap: 3px;
    background-color: #470765;
    border-radius: 4%;
    box-shadow: rgba(50, 50, 93, 0.9) 0px 2px 9px -1px, rgba(0, 0, 0, 0.9) 0px 1px 3px -1px;
    &:hover,
  &:focus {
    position:relative;
    /* bottom: 10px; */
    right: 10px;
    ${Mask} {
      opacity: 1;
    }
    }
    cursor: pointer;
`;


const TrackLeft = styled.div`
    width: 130px;
    height: 140px;
    border-radius: 30%;
    /* background-color: yellow; */
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    
    img {
        width: 140px;
        height: 140px;
        border-radius: 10%;
    }
`;

const TrackMiddle = styled.div`
    /* background-color: blue; */
    display: inline-block;
    color: white;   
    .trackName{
        height: 60px;
        margin-top: 10px;
        margin-bottom: 30px;  
        margin-right: 15px;
        font-weight: 900;
        font-size: 16px;
        /* background-color: red; */
        padding: 0%;
        /* overflow-y: hidden; */
    }
    .artistName{
        font-weight: 400;
        margin-top: 10px;
        margin-bottom: 39px;    
        height: 20px;   
    }
    .rank{
        height: 2px;
        font-size: 25px;
        text-align: right; 
        margin-right: 30px;
        padding-bottom: 10px;
        /* background-color: pink; */
    }
`;

const Ranges = styled.div`
  display: flex;
  margin-left: 1100px;
`;

const RangeButton = styled.button`
  font-family: 'Courier New', Courier, monospace;
  background-color: transparent;
  color: ${props => (props.isActive ? "white " : "black")};
  font-size: 20px;
  font-weight: 800;
  padding: 10px;
  span {
    padding-bottom: 2px;
    line-height: 1.5;
    white-space: nowrap;
  }
`;


/////////////////////////////////
// main component
const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    const [range, setRange] = useState(null);

    const rangeApis = {
        long: getTopTracksLong(),
        short: getTopTracksShort(),
    };

    useEffect(() => {
        const fetchTracks = async () => {
            const { topTracks } = await getUserInfo();
            setTopTracks(topTracks.items.slice(0, 21));
        };
        catchErrors(fetchTracks());
    }, []);

    const changeRange = async (range) => {
        const { data } = await rangeApis[range];
        setTopTracks(data.items);
        setRange(range);
    }
    const setRangeData = range => catchErrors(changeRange(range));


    return (
        <Main>
            <Body>
                <Title> Top Tracks </Title>
                <Ranges>
                    <RangeButton isActive={range === 'long'} onClick={() => setRangeData('long')}>
                        <span>All Time</span>
                    </RangeButton>
                    <RangeButton isActive={range === 'short'} onClick={() => setRangeData('short')}>
                        <span>Last Month</span>
                    </RangeButton>
                </Ranges>
                <TrackContainer>
                    {
                        topTracks && (
                            topTracks.map((track, i) => (
                                <TrackInfo key={i}>
                                    <Mask> Info </Mask>
                                    <TrackLeft>
                                        <img src={track.album.images[0].url} alt={track.album.name}></img>
                                    </TrackLeft>

                                    <TrackMiddle>
                                        <p className='trackName'> {track.name} </p>
                                        <p className='artistName'> {track.artists[0].name} </p>
                                        <p className='rank'> {i + 1} </p>
                                    </TrackMiddle>
                                </TrackInfo>
                            ))
                        )
                    }
                </TrackContainer>
            </Body>

        </Main>

    )

};


export default TopTracks;
