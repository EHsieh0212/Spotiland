import { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getTopTracksLong, getTopTracksShort } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';
// track popup info
// Track-detail popup disabled — it relied on deprecated Spotify
// audio-features / audio-analysis endpoints (now return 403).
// import PopupTrack from './PopupTrack';


/////////////////////////////////
// styled components
// 1. basics
const Body = styled.div`
    background-color: ${props => props.opacityChange? 'rgba(0, 0, 0, 0.9)' : 'rgba(246, 113, 151, 1)'};
    /* background-color: #F67197; */
    opacity: ${props => props.opacityChange? 0.2 : null};
`;

const Title = styled.h1`
    grid-column: 2;
    padding-top: 20px;
    margin-top: 0px;
    font-size: 60px;
    font-weight: 900;
    color: white;
    font-family: 'Courier New', Courier, monospace;
`;


// 2. track related
const TrackContainer = styled.div`
    /* background-color: yellow; */
    display: grid;
    /* Always 5 tracks per row */
    grid-template-columns: repeat(5, 1fr);
    /* Fixed row height so a hovered card can span exactly 2 rows. */
    grid-auto-rows: 175px;
    /* wider spacing between rows; columns keep the original 25px */
    grid-column-gap: 25px;
    grid-row-gap: 60px;
    margin-top: 20px;
    margin-left: 100px;
    margin-right: 100px;
    margin-bottom: 0px;
    padding-bottom: 190px;
`;

const TrackInfo = styled.div`
    display: grid;
    grid-template-columns: auto 70px;
    min-width: fit-content;
    max-height: 175px;
    /* grid-gap: 10px; */
    /* background-color: #470765; */
    background-color: ${props => props.opacityChange? 'rgba(0, 0, 0, 0.1)' : 'rgba(71, 7, 101, 1)'};
    opacity: ${props => props.opacityChange? 0.5 : null}; 
    border-radius: 4%;
    box-shadow: rgba(50, 50, 93, 0.9) 0px 2px 9px -1px, rgba(0, 0, 0, 0.9) 0px 1px 3px -1px;
    cursor: pointer;
    /* Smooth the growth of the inner content (the grid reflow itself is instant). */
    transition: max-height 0.25s ease;
    img { transition: width 0.25s ease, height 0.25s ease; }
    .trackName, span, .rank { transition: font-size 0.25s ease; }
    .try{
        display: inline-block;
    }

    /* Hover: expand in place to a 2x2 block; the grid reflows the other cards
       in order at their normal size. The exact grid-area (hoverCol/hoverRow) is
       computed per card so the enlarged card ALWAYS covers its own cell —
       expanding leftward at the right edge and upward on the last row. Without
       that, a right-/bottom-edge card would slide out from under the cursor,
       lose :hover, snap back, and flicker (the image never settling large). */
    &:hover {
        grid-column: ${props => props.hoverCol};
        grid-row: ${props => props.hoverRow};
        grid-template-columns: auto 140px;
        max-height: none;
        z-index: 2;
        img {
            /* original 112px doubled */
            width: 224px;
            height: 224px;
        }
        /* let the text column (TrackMiddle) fill the taller card so the rank
           still sits at the bottom */
        & > div:last-child {
            height: 100%;
        }
        .trackName { font-size: 22px; }
        span { font-size: 18px; }
        .rank { font-size: 36px; }
    }
`;

//會被TrackInfo覆蓋
const TrackLeft = styled.div`
    /* background-color: yellow; */
    /* width: 170px; */
    /* height: 40px;  */
    display: inline-block;
    justify-content: center;
    align-items: center;
    margin: 7px;
    img {
        /* original 160px scaled uniformly by 0.7 */
        width: 112px;
        height: 112px;
        max-width: none; /* override global img{max-width:100%} that was squishing width to 136px */
        object-fit: cover;
        border-radius: 10%;
    }
`;

const TrackMiddle = styled.div`
    display: grid;
    /* original 250px scaled uniformly by 0.7 */
    height: 175px;
    grid-template-rows: repeat(auto-fit, minmax(175px));
    color: white;
    /* width: fit-content; */

    /* background-color : yellow; */
    .trackName{
        display: flex;
        flex-direction: column;
        font-weight: 900;
        font-size: 11px;
        margin-top: 7px;
        margin-right: 4px;
        /* background-color: red; */
    }
    span{
        padding-top: 21px;
        /* background-color: green; */
        font-size: 9px;
        font-weight: 500;
    }
    .rank{
        display: flex;
        /* height: 100%; */
        /* flex-direction: r; */
        margin-top: auto;
        flex-wrap: wrap;
        font-size: 18px;
        align-self: bottom;
        justify-content: right;
        margin-right: 5px;
        margin-bottom: 5px;
        /* background-color: pink; */
    }
`;

// 3 columns: equal 1fr on both sides keep the Title (middle) dead-center,
// while the range toggle sits at the start of the right column, beside it.
const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 40px;
`;

const Ranges = styled.div`
  /* Just beside the centered title — not pinned to the right edge,
     which overlapped the fixed top-right avatar. */
  grid-column: 3;
  justify-self: start;
  margin-left: 20px;
  display: flex;
  align-items: center;
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
const TopTracks = ({refPlace}) => {
    const [topTracks, setTopTracks] = useState(null);
    const [range, setRange] = useState(null);
    // const [openPopup, setOpenPopup] = useState(false); // only drove the removed track-detail popup dim
    

    const rangeApis = {
        long: getTopTracksLong(),
        short: getTopTracksShort(),
    };

    useEffect(() => {
        // Default to Last Month (short_term) on first load.
        const fetchTracks = async () => {
            const { data } = await getTopTracksShort();
            setTopTracks(data.items.slice(0, 21));
            setRange('short');
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
                <HeaderRow>
                    <Title id="toptracks" ref={refPlace}> Top Tracks </Title>
                    <Ranges>
                        <RangeButton isActive={range === 'long'} onClick={() => setRangeData('long')}>
                            <span>All Time</span>
                        </RangeButton>
                        <RangeButton isActive={range === 'short'} onClick={() => setRangeData('short')}>
                            <span>Last Month</span>
                        </RangeButton>
                    </Ranges>
                </HeaderRow>

                <TrackContainer>
                    {
                        topTracks && (
                            topTracks.map((track, i) => {
                                // Grid area for the hover expansion. The card grows into a
                                // 2x2 block that always includes its own cell: it expands
                                // right normally, left when it's the last column, down
                                // normally, and up when it's on the last row — so it never
                                // slides out from under the cursor.
                                const PER_ROW = 5;
                                const totalRows = Math.ceil(topTracks.length / PER_ROW);
                                const col = i % PER_ROW;             // 0-based column
                                const row = Math.floor(i / PER_ROW); // 0-based row
                                const c = col + 1;                   // this column's start grid line
                                const r = row + 1;                   // this row's start grid line
                                const rightmost = col === PER_ROW - 1;
                                const lastRow = row === totalRows - 1;
                                const hoverCol = rightmost ? `${c - 1} / ${c + 1}` : `${c} / ${c + 2}`;
                                const hoverRow = (lastRow && r > 1) ? `${r - 1} / ${r + 1}` : `${r} / ${r + 2}`;
                                return (
                                    <TrackInfo key={i} hoverCol={hoverCol} hoverRow={hoverRow}>
                                        {/* Track-detail popup removed (deprecated audio endpoints → 403):
                                        <PopupTrack
                                            trackId={track.id}
                                            trigger={<Mask> Info </Mask>}
                                            onDim={setOpenPopup}
                                            onNorm={() => setOpenPopup(false)}
                                        /> */}
                                        <TrackLeft>
                                            <img src={track.album.images[0].url} alt={track.album.name}></img>
                                        </TrackLeft>
                                        <TrackMiddle>
                                            <div className='trackName'> {track.name} <span>{track.artists[0].name} </span> </div>
                                            <div className='rank'> {i + 1} </div>
                                        </TrackMiddle>
                                    </TrackInfo>
                                );
                            })
                        )
                    }
                </TrackContainer>
            </Body>
        </Main>

    )

};


export default TopTracks;
