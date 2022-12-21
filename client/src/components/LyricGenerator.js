import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
// higher order error handler
import { catchErrors } from '../utils/index'
// css
import { Main } from '../styles';
import { predict } from '../spotify/crawl';
// other components
import Loader from './Loader';


/////////////////////////////////////////////
// styled components
const Title = styled.div`
    display: flex;
    justify-content: center;
    font-size: 100px;
    margin-bottom: 70px;
    font-family: 'Courier New', Courier, monospace;
`;

const Select = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 100px;
    margin-bottom: 70px;
    font-size: 40px;
    font-weight: 900;
    font-family: 'Courier New', Courier, monospace;
    /* background-color: pink; */
    .two{
        color: red;
    }
    img{
        width: 250px;
        height: 230px;
    }
    .displayArtist{
        display: flex;
        flex-direction: column;
    }
    .selections{
        display: flex;
    }
`;


const SelectButton = styled.button`
  font-family: 'Courier New', Courier, monospace;
  /* background-color: black; */
  background-color: ${props => (props.stay ? "green" : "black")};;
  color: white;
  border-radius: 30px;
  padding: 17px 35px;
  min-width: 160px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  margin-top: 20px;
  margin-right: 20px;
  &:hover,
  &:focus,
  &.isActive{
    background-color: green;
  }
`;

const EnterLength = styled.input`
    font-size: 20px;
    font-weight: 500;
    border: 2px solid black;
    width: 300px;
    height: 40px;
    &:hover,
    &:focus {
        border: 5px solid green;
  }
`;

const Result = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 150px;
    margin-left: 100px;
    margin-bottom: 90px;
    font-size: 60px;
    font-weight: 900;
    font-family: 'Courier New', Courier, monospace;
    justify-content: center;
    text-align: center;
    p{
        text-align: left;
        font-size: 20px;
        text-decoration: underline;
    }
`;

const ResultText = styled.div`
    margin-top: 70px;
    margin-left: 50px;
    margin-right: 70px;
    margin-bottom: 30px;
    font-size: 19px;
    color: brown;
    font-weight: 500;
    text-align: left;
`;

const GetResult = styled.a`
    font-family: Courier, monospace;
  background-color: white;
  color: black;
  padding: 17px 35px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin-top: 50px;
  margin-left: 100px;
  margin-bottom: 70px;
  &:hover,
  &:focus {
    color: pink;
  }
`;


/////////////////////////////////////////////
// Main Lyric Generator Components
const LyricGenerator = () => {
    // use state
    const [model, setModel] = useState(null);
    const [artist, setArtist] = useState(null);
    const [length, setLength] = useState(null);
    const [seeding, setSeeding] = useState(null);
    const [crawl, setCrawl] = useState(null);
    const [getAResult, setGetAResult] = useState(false);

    // use effect
    useEffect(() => {
    }, [artist, length, seeding, getAResult]);

    // post input to modelFlask, return predicted crawl to state
    const getResult = async () => {
        try {
            setGetAResult(true);
            if (getAResult == true){
                if (artist | length| seeding === null){
                alert("Please select before getting result.")
                }
            }
            const result = await predict(artist, length, seeding);
            setCrawl(JSON.stringify(result.data.return));
            alert("See Results below!")
        } catch (error) {
            setCrawl("error")
            console.log(error)
        }
    }

    const refresh = () => {
        window.location.reload();
        window.scrollTo(0, 0);
    }


    // jsx
    return (
        <React.Fragment>
            <Main>
                <Title>
                    Lyric Generator
                </Title>
                <Select>
                    <span className='one'>1. Select A <span className='two'>Language Model</span>:</span>
                    <div>
                        <SelectButton id="model" value='n-gram' onClick={(e) => { setModel(e.target.value) }} stay={model === 'n-gram'? true:false}> n-gram </SelectButton>
                        <SelectButton value='gpt-2' onClick={(e) => { setModel(e.target.value) }} stay={model === 'gpt-2'? true:false}> gpt-2 </SelectButton>
                    </div>

                </Select>
                <Select>
                    <span className='one'>2. Select A <span className='two'>Singer</span>:</span>
                    <div className='selections'>
                        <div className='displayArtist'>
                        <img src='https://bccnews.com.tw/wp-content/uploads/2022/09/202209011229ANG.jpg'></img>
                        <SelectButton id="artist" value='piggyLo' stay={artist === 'piggyLo'? true:false} onClick={(e) => { setArtist(e.target.value) }}> piggyLo </SelectButton>
                        </div>
                        <div className='displayArtist'>
                        <img src="https://images.chinatimes.com/newsphoto/2022-05-01/1024/20220501002968.jpg"></img>
                        <SelectButton id="artist" value='jolin2' onClick={(e) => { setArtist(e.target.value) }} stay={artist === 'jolin2'? true:false}> jolin </SelectButton>
                        </div>
                    </div>
                </Select>
                <Select>
                    <span className='one'>3. Enter <span className='two'>Length of Lyrics</span>:</span>
                    <EnterLength id="length" onChange={(e) => { setLength(e.target.value) }} />
                </Select>
                <Select>
                    <span className='one'>4. Enter <span className='two'>A Seeding</span>:</span>
                    <EnterLength id="seed" onChange={(e) => { setSeeding(e.target.value) }} />
                </Select>
                <GetResult onClick={catchErrors(getResult)}> {'>>>'} Finished? Get Result</GetResult>

                {getAResult ?
                    (<Result>
                        Result:
                        <p>歌手名稱:  {artist} </p>
                        <p>歌詞長度:  {length} 個字</p>
                        <p>使用模型:  {model} </p>
                        <p>模型資訊:   </p>
                        {crawl ? (<ResultText>{crawl}</ResultText>) : (<Loader />)}
                        <div className='refresh'>
                            <SelectButton onClick={(e) => {refresh()}}> Refresh</SelectButton>
                        </div>
                    </Result>
                    )
                    :
                    null}
            </Main>

        </React.Fragment>
    )
}

export default LyricGenerator;