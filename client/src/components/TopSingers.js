import { useState, useEffect } from 'react';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getUserInfo, getTopArtistsLong, getTopArtistsShort } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';
// artist popup info
import PopupArtist2 from './PopupArtist2';


/////////////////////////////////
// styled component
// background color是個好用的東西
// 1. basics
const Body = styled.div`
    /* background-color: #F6F19C; */
    /* background-color: (0, 0, 0, 1); */
    background-color: ${props => props.opacityChange? 'rgba(0, 0, 0, 0.9)' : 'rgba(246, 241, 156, 1)'};
    justify-content: center;
    opacity: ${props => props.opacityChange? 0.2 : null};
`;

const Title = styled.h1`
    padding-top: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
    font-size: 60px;
    font-weight: 900;
`;

// 2. artist related
// grid, 掌控column寬度
const ArtistsContainer = styled.div`
    /* background-color: yellow; */
    display: grid;
    /* width: 80%; */
    /* align-items: center; */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 25px;
    margin-top: 20px;
    margin-left: 150px;
    margin-right: 150px;
    margin-bottom: 0px;
    padding-bottom: 190px;
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
  &:hover,
  &:focus {
    position:relative;
    bottom: 10px;
    left: auto;
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
    width: 200px;
    height: 200px; 
    margin-top: 20px;
    margin-bottom: 120px;
    &:hover,
    &:focus {
     ${Mask} {
        /* background-color: green; */
      opacity: 1;
    }}
    img {
        border-radius: 100%;
        width: 200px;
        height: 200px;
        object-fit: cover;  /* 切出固定大小範圍圈圈，再予以填滿 */
    }
    .name{
        /* background-color: pink; */
        font-size: 20px;
        font-weight: 900;
        color: white;
        margin-top: 30px;
        text-align: center;
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
    width: 200px;
    height: 80px; 
    .rank{
        /* for: 限縮背景寬度*/
        display: inline-block;   
        margin: 20 auto;
        padding: 20px 5px;
        width: 60px;
        height: 60px;
        border-radius: 100%;
        border:1px solid white;
        color: white;
        text-align: center;
        text-shadow: 50px;
        font-weight: 90px;
        font-size: 19px;
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
        const fetchArtists = async () => {
            const { topArtists } = await getUserInfo();
            if (topArtists.items.length > 20) {
                setTopSingers(topArtists.items.slice(0, 20));
            } else {
                setTopSingers(topArtists.items);
            }
        };
        // console.log(openPopup)
        catchErrors(fetchArtists());
    }, []);


    //////////////////////////////////////////////////////////
    // jsx
    return (
        <Main>
            <Body opacityChange={openPopup}>
                <Title id='topsingers' ref={refPlace}> Top Singers </Title>
                <Ranges>
                    <RangeButton isActive={range === 'long'} onClick={() => setRangeData('long')}>
                        <span>All Time</span>
                    </RangeButton>
                    <RangeButton isActive={range === 'short'} onClick={() => setRangeData('short')}>
                        <span>Last Month</span>
                    </RangeButton>
                </Ranges>
                <ArtistsContainer>
                    {topSingers && (
                        topSingers.map((singer, i) => (
                            <ArtistSection key={i} opacityChange={openPopup}>
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
