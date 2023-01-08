import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components/macro';
import { getArtist } from "../spotify";
// higher order error handler
import { catchErrors, formatWithCommas } from '../utils';


///////////////////////////////////////////////////////////
// styled component
const Modal = styled.div`
    font-size: 12px;
    color: white;
    background-color: rgba(27, 30, 30  , 0.95);
    width: 800px;
    min-height: 580px;
    max-height: fit-content;
    border: 2px solid black;
    @keyframes anvil {
        0% {
        transform: scale(1) translateY(0px);
        opacity: 0;
        box-shadow: 0 0 0 rgba(241, 241, 241, 0);
        }
        1% {
        transform: scale(0.96) translateY(10px);
        opacity: 0;
        box-shadow: 0 0 0 rgba(241, 241, 241, 0);
        }
        100% {
        transform: scale(1) translateY(0px);
        opacity: 1;
        box-shadow: 0 0 500px rgba(241, 241, 241, 0);
        }
    }
    -webkit-animation: anvil 0.54s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;
    .header {
        width: 100%;
        border-bottom: 1px solid gray;
        font-size: 18px;
        text-align: center;
        padding: 5px;
    }
    .content {
        width: 100%;
        padding: 10px 5px;
    }
    .actions {
        width: 100%;
        padding: 10px 5px;
        margin: auto;
        text-align: center;
    }
    .close {
        cursor: pointer;
        color:white;
        background-color: rgba(0,0,0,0);
        position: absolute;
        display: block;
        padding: 2px 5px;
        line-height: 20px;
        right: -1px;
        top: -1px;
        font-size: 24px;
        border-radius: 18px;
        border: 0px solid #cfcece;
}
`

const Container = styled.div`
    flex-direction: column;
    height: 100%;
    text-align: center;
    margin-top: 50px;
    margin-left: 10px;
    margin-right: 20px;
    margin-bottom: 30px;
`;

const Artwork = styled.div`
  border-radius: 100%;
  justify-content: center;
  img {
    object-fit: cover; /*填滿元素的寬度及高度(維持原比例)，通常會剪掉部分的物件 -> prevent from distortion*/
    border-radius: 100%;
    width: 280px;
    height: 280px;
    
  }
`;
const ArtistName = styled.div`
    color:white;
    font-size: 47px;
    font-weight: 2750px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-weight: 210px;
    text-align: center;
`;


const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  text-align: center;
`;

const Stat = styled.div``;

const Number = styled.div`
    color: white;
    font-size: 22px;
    font-weight: 700;
    text-transform: capitalize;
`;

const NumberLabel = styled.div`
    color: grey;
    font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;


///////////////////////////////////////////////////////////
// main component
const PopupArtist2 = ({ singerId, trigger, onDim, onNorm }) => {
    const [asingerInfo, setASingerInfo] = useState(null);

    //////////////////////////////////////////
    const getArtistInfo = async (id, afn) => {
        const data = await getArtist(id);
        setASingerInfo(data.data);
        afn(true);
    }
    const retrieveArtistInfo = (id, afn) => catchErrors(getArtistInfo(id, afn));

    return (
        <Popup
            trigger={trigger}
            modal
            closeOnDocumentClick={false}
            onOpen={() => { retrieveArtistInfo(singerId, onDim) }}
            onClose={onNorm}
        >
            {close => (
                <Modal>
                    <button className="close" onClick={close}> X </button>
                    <div className="content">
                        {asingerInfo ?
                            (<Container>
                                {/* <div>
                            {JSON.stringify(asingerInfo)}
                            </div> */}
                                <Artwork>
                                    {<img src={asingerInfo.images[0].url} alt="Artist Artwork" />}
                                </Artwork>
                                <ArtistName>{asingerInfo.name}</ArtistName>
                                <Stats>
                                    <Stat>
                                        <Number>
                                            {asingerInfo.popularity}%
                                        </Number>
                                        <NumberLabel>popularity</NumberLabel>
                                    </Stat>
                                    <Stat>
                                        <Number>
                                            {formatWithCommas(asingerInfo.followers.total)}
                                        </Number>
                                        <NumberLabel>followers</NumberLabel>
                                    </Stat>
                                    <Stat>
                                        <Number>
                                            {asingerInfo.genres && asingerInfo.genres.map((genre, i) => (<div key={i}>{genre}</div>))}
                                        </Number>
                                        <NumberLabel>genre</NumberLabel>
                                    </Stat>

                                </Stats>
                            </Container>)
                            : "loading"}
                    </div>
                </Modal>
            )}
        </Popup>)
};

export default PopupArtist2;