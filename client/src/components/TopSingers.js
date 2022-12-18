import { useState, useEffect } from 'react';
import { Link } from '@reach/router';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// fetch functions
import { getUserInfo } from '../spotify';
// higher order error handler
import { catchErrors } from '../utils';


/////////////////////////////////
// styled component
// background color是個好用的東西
// 1. basics
const Body = styled.body`
    background-color: #F6F19C;
    margin: 0px;
    padding: 0px;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 25px;
    margin-top: 20px;
    margin-left: 80px;
    margin-right: 80px;
    margin-bottom: 0px;
    padding-bottom: 190px;
`;

//主要區域，存放：1.mask 2.image 3.name
const ArtistSection = styled.div`
  display: flex;
  background-color: #C4540C;
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

const ArtistInfo = styled(Link)`
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
    /* display: inline-block; */
    /* background-color: red; */
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
        /* background-color: pink; */
        text-align: center;
        text-shadow: 50px;
        font-weight: 90px;
        font-size: 19px;
    }
`;


const Ranges = styled.div`
  display: flex;

`;

const RangeButton = styled.button`

  background-color: transparent;
  color: ${props => (props.isActive ? "white" : "black")};
  font-size: 10px;
  font-weight: 500;
  padding: 10px;
  span {
    
    padding-bottom: 2px;
    line-height: 1.5;
    white-space: nowrap;
  }
`;




/////////////////////////////////
// main component
const TopSingers = () => {
    // use state
    const [topSingers, setTopSingers] = useState(null);

    // use effect
    useEffect(() => {
        const fetchArtists = async () => {
            const { topArtists } = await getUserInfo();
            setTopSingers(topArtists.items.slice(0, 20));
        };
        catchErrors(fetchArtists());
    }, []);


    // jsx
    return (
        <Main>
            <Body>
                <Title> Top Singers </Title>
                <Ranges>
                    <RangeButton> <span>All Time</span> </RangeButton>
                    <RangeButton> <span>Last Month</span> </RangeButton>
                </Ranges>
                <ArtistsContainer>
                    {topSingers && (
                        topSingers.map((singer, i) => (
                            <ArtistSection key={i} >
                                <Rank>
                                    <p className='rank'> {i + 1} </p>
                                </Rank>
                                <ArtistInfo to='/'>
                                    <Mask> Info </Mask>
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
