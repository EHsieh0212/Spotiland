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
`;

const Title = styled.h1`
    padding-top: 20px;
    margin-top: 0px;
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
    margin-left: 250px;
    margin-right: 250px;
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
  width: 100px;
  height: 100px;
  border-radius: 4%;
  /* background-color: rgba(0, 0, 0, 0.6); */
  background-color: yellow;
  opacity: 0;
  color: white;
  font-weight: 800;
`;


const TrackInfo = styled.div`   
    display: grid;
    grid-template-columns: auto 100px;
    min-width: fit-content;
    max-height: 250px;
    /* grid-gap: 10px; */
    background-color: #470765;
    border-radius: 4%;
    box-shadow: rgba(50, 50, 93, 0.9) 0px 2px 9px -1px, rgba(0, 0, 0, 0.9) 0px 1px 3px -1px;
    .try{
        display: inline-block;
    }
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
    /* background-color: yellow; */
    /* width: 170px; */
    height: 40px; 
    display: inline-block;
    justify-content: center;
    align-items: center;
    margin: 10px;
    img {
        width: 160px;
        height: 160px;
        border-radius: 10%;
    }
`;

const TrackMiddle = styled.div`
    display: grid;
    height: 250px;
    grid-template-rows: repeat(auto-fit, minmax(250px));
    color: white;  
    /* background-color : yellow; */
    .trackName{
        display: flex;
        flex-direction: column;
        font-weight: 900;
        font-size: 16px;
        margin-top: 10px;
        margin-right: 5px;
        /* background-color: red; */
    }
    span{
        padding-top: 30px;
        /* background-color: green; */
        font-size: 12px;
        font-weight: 500;
    }
    .rank{
        display: flex;
        /* height: 100%; */
        /* flex-direction: r; */
        margin-top: auto;
        flex-wrap: wrap;
        font-size: 25px;
        align-self: bottom;
        justify-content: right;
        margin-right: 5px;
        margin-bottom: 5px;
        /* background-color: pink; */
    }
`;

const Ranges = styled.div`
  display: flex;
  justify-content: right;
  margin-right: 20px;
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
                <div>
                <Ranges>
                    <RangeButton isActive={range === 'long'} onClick={() => setRangeData('long')}>
                        <span>All Time</span>
                    </RangeButton>
                    <RangeButton isActive={range === 'short'} onClick={() => setRangeData('short')}>
                        <span>Last Month</span>
                    </RangeButton>
                </Ranges>
                </div>

                <TrackContainer>
                    {
                        topTracks && (
                            topTracks.map((track, i) => (
                                <TrackInfo key={i}>
                                    <TrackLeft>
                                        <img src={track.album.images[0].url} alt={track.album.name}></img>
                                    </TrackLeft>
                                    <TrackMiddle>
                                        <div className='trackName'> {track.name} <span>{track.artists[0].name} </span> </div>
                                        <div className='rank'> {i + 1} </div>
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
