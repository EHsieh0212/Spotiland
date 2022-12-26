import styled from 'styled-components/macro';
import { useState, useEffect } from "react";
import { getArtist } from "../spotify";
// higher order error handler
import { catchErrors } from '../utils';



/////////////////////////////////////////////
// styled component
const PopupBox = styled.div`
    position: fixed;
    /* background: transparent; */
    /* opacity: 0.4; */
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
`;

const Box = styled.div`
    display: inline-flex;
    flex-direction: row;
    min-width: 80%;
    flex-wrap: wrap;
    position: relative;
    width: 60%;
    /* margin: 0 auto; */
    margin-left: 240px;
    margin-right: 100px;
    height: auto;
    margin-top: calc(100vh - 85vh - 20px);
    /* background: white; */
    border-radius: 4px;
    padding: 20px;
    border: 1px solid #999;
    justify-content: center;
    /* background-color: red; */
    /* overflow: x; */
    .content{
      /* flex-basis: 0px; */
      /* flex-grow: 1; */
      /* background-color: green; */
      font-size: 10px;

    };
    .close-icon{
        cursor: pointer;
        position: fixed;

        /* right: calc(35% - 10px);
        top: calc(100vh - 85vh - 33px); */
        /* background: #ededed; */
        width: fit-content;
        border-radius: 20%;
        line-height: 20px;
        text-align: center;
        border: 1px solid #999;
        font-size: 20px;
        &:hover,
        &:focus{
          background-color: green;
          /* opacity: 1; */
        }
    }
`;


/////////////////////////////////////////////
// component
export const PopupArtist = props => {
  // use state
  const [artist, setArtist] = useState(null);

  // use effect
  useEffect(() => {
    const fetchArtist = async () => {
      const data = await getArtist('0TnOYISbd1XYRBk9myaseg');
      setArtist(data.data)
      console.log(artist);
    }
    catchErrors(fetchArtist());
  }, [])


  return (
    <PopupBox>
      <Box>
        <div className='content'>
          {artist ? (JSON.stringify(artist)) : ("loading")}
        </div>
        <div>
          <span className="close-icon" onClick={props.handleClose}>close</span>
        </div>
      </Box>
    </PopupBox>
  );
};


