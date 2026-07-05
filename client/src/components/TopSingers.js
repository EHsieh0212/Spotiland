import { useState, useEffect } from 'react';
// css
import styled, { keyframes } from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getTopArtistsLong, getTopArtistsShort } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';
// artist popup info
import PopupArtist2 from './PopupArtist2';


/////////////////////////////////
// styled component
// background color是個好用的東西
// 1. basics
const Body = styled.div`
    position: relative;
    background-color: rgba(246, 241, 156, 1);
    justify-content: center;
    /* Yellow semi-transparent mask shown while a singer popup is open */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(246, 241, 156, 0.8);
      opacity: ${props => (props.opacityChange ? 1 : 0)};
      transition: opacity 0.25s ease;
      pointer-events: none;
      z-index: 5;
    }
`;

const Title = styled.h1`
    grid-column: 2;
    color: ${props => props.opacityChange? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 1)'};
    margin-top: 0;
    padding-top: 20px;
    font-size: 60px;
    font-weight: 900;
    font-family: 'Courier New', Courier, monospace;
`;

// 2. artist related
// grid, 掌控column寬度
const ArtistsContainer = styled.div`
    /* background-color: yellow; */
    display: grid;
    /* width: 80%; */
    /* align-items: center; */
    /* Always 5 singers per row */
    grid-template-columns: repeat(5, 1fr);
    /* wider spacing between rows; columns keep the original 25px */
    grid-column-gap: 25px;
    grid-row-gap: 60px;
    margin-top: 20px;
    margin-left: 100px;
    margin-right: 100px;
    margin-bottom: 0px;
    padding-bottom: 190px;
`;

// Gentle up-and-down bob for each singer card.
const floatAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
`;

//主要區域，存放：1.mask 2.image 3.name
const ArtistSection = styled.div`
  display: flex;
  /* background-color: black; */
  background-color: ${props => props.opacityChange? 'rgba(0, 0, 0, 0.8)' : 'rgba(196, 84, 12, 1)'};
  opacity: ${props => props.opacityChange? 0.5 : null};
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(50, 50, 93, 0.9) 0px 2px 9px -1px, rgba(0, 0, 0, 0.9) 0px 1px 3px -1px;
  /* background-color: pink; */
  /* Subtle floating; per-card delay (set inline) keeps them out of sync. */
  animation: ${floatAnim} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  justify-self: center;
  width: 170px;
  &:hover,
  &:focus {
    position:relative;
    bottom: 10px;
    left: auto;
    /* Hold still while lifted on hover. */
    animation-play-state: paused;
}
    cursor: pointer;
`;

// 要先放Mask, 再放ArtistInfo
const Mask = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  opacity: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ArtistInfo = styled.div`
    /* background-color: green; */
    display: inline-block;
    position: relative;
    /* original 200px scaled uniformly by 0.7 */
    width: 140px;
    height: 140px;
    margin-top: 14px;
    /* tightened from 84px — the narrow 170px card looked bottom-heavy */
    margin-bottom: 48px;
    &:hover,
    &:focus {
     ${Mask} {
        /* background-color: green; */
      opacity: 1;
    }}
    img {
        border-radius: 100%;
        width: 140px;
        height: 140px;
        object-fit: cover;  /* 切出固定大小範圍圈圈，再予以填滿 */
    }
    .name{
        /* background-color: pink; */
        font-size: 14px;
        font-weight: 900;
        color: white;
        margin-top: 21px;
        text-align: center;
        /* keep every card the same height: long names truncate with … */
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid transparent;
        &:hover,
        &:focus {
            color: green;
            cursor: pointer;
        }
    }

`;

const Rank = styled.div`
    /* for: 左邊對齊*/
    position: relative;
    /* original 200x80 scaled uniformly by 0.7 */
    width: 140px;
    height: 56px;
    .rank{
        /* for: 限縮背景寬度*/
        display: inline-block;
        margin: 14px auto;
        padding: 14px 4px;
        width: 42px;
        height: 42px;
        border-radius: 100%;
        border:1px solid white;
        color: white;
        text-align: center;
        text-shadow: 50px;
        font-weight: 90px;
        font-size: 13px;
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

const MoreBtn = styled.div`
  display: flex;
  width: fit-content;
  background-color: black;
  color: white;
  border-radius: 30px;
  
  margin-left: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: green;
  }
  a{
    padding: 10px;
  }
`;

/////////////////////////////////
/////////////////////////////////
// main component
const TopSingers = ({refPlace}) => {
    // use state
    const [topSingers, setTopSingers] = useState(null);
    const [range, setRange] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

    //////////////////////////////////////////////////////////
    const rangeApis = {
        long: getTopArtistsLong(),
        short: getTopArtistsShort(),
    };
    const changeRange = async (range) => {
        const { data } = await rangeApis[range];
        if (data.items.length > 20) {
            setTopSingers(data.items.slice(0, 20));
        } else {
            setTopSingers(data.items);
        }
        setRange(range);
    }
    const setRangeData = range => catchErrors(changeRange(range));

    //////////////////////////////////////////////////////////
    // use effect
    useEffect(() => {
        // Default to Last Month (short_term) on first load.
        const fetchArtists = async () => {
            const { data } = await getTopArtistsShort();
            if (data.items.length > 20) {
                setTopSingers(data.items.slice(0, 20));
            } else {
                setTopSingers(data.items);
            }
            setRange('short');
        };
        catchErrors(fetchArtists());
    }, []);


    //////////////////////////////////////////////////////////
    // jsx
    return (
        <Main>
            <Body opacityChange={openPopup}>
                <HeaderRow>
                    <Title id='topsingers' ref={refPlace} opacityChange={openPopup}> Top Singers </Title>
                    <Ranges>
                        <RangeButton isActive={range === 'long'} onClick={() => setRangeData('long')}>
                            <span>All Time</span>
                        </RangeButton>
                        <RangeButton isActive={range === 'short'} onClick={() => setRangeData('short')}>
                            <span>Last Month</span>
                        </RangeButton>
                    </Ranges>
                </HeaderRow>
                <ArtistsContainer>
                    {topSingers && (
                        topSingers.map((singer, i) => (
                            <ArtistSection key={i} opacityChange={openPopup} delay={(i % 5) * 0.2}>
                                <Rank>
                                    <p className='rank'> {i + 1} </p>
                                </Rank>
                                <ArtistInfo>
                                    <PopupArtist2
                                        singerId={singer.id}
                                        trigger={<Mask> Info </Mask>}
                                        onDim={setOpenPopup}
                                        onNorm={() => setOpenPopup(false)}
                                    />
                                    <img src={singer.images[0].url} alt={singer.name} />
                                    <p className='name'> {singer.name} </p>
                                </ArtistInfo>
                            </ArtistSection>
                        ))
                    )
                    }
                </ArtistsContainer>
            </Body>
        </Main>
    )
};

export default TopSingers;
