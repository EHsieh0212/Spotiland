import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components/macro';
import { getTrackInfo } from "../spotify";
// higher order error handler
import { catchErrors, getYear, formatDuration, parsePitchClass } from '../utils';
import Loader from './Loader';
import PopupTrackChart from './PopupTrackChart';


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
`;

////////////////////////////////////////////
const Main = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

`;


const TrackIntro = styled.div`
    /* background-color: yellow; */
    display: flex;
    margin-bottom: 20px;
    margin-left: 9px;
    justify-content: center;
`;

const Artwork = styled.div`
  max-width: 190px;
  margin-right: 30px;
  /* background-color: greenyellow; */
  img{
    border-radius: 10%;
  }
`;

const Info = styled.div`
`;

const Title = styled.h1`
    /* background-color: yellow;  */
    font-size: 42px;
    margin-bottom: 0px;
`;

const ArtistName = styled.h2`
  color: grey;
  font-size: 30px;
  font-weight: 700;
  text-align: left !important;
  margin-top: 22px;
  margin-bottom: 0px;
  /* background-color: pink; */
`;

const AlbumInfo = styled.h3`
  color: grey;
  font-weight: 400;
  font-size: 16px;
`;

const Breaker = styled.div`
    display: flex;
    margin-top: 7px;
    margin-left: 30px;
    margin-right: 30px;
    border-top: 1px solid;
    /* background-color: yellow; */
    justify-content: center;
    /* width: 500px; */
`;

const AudioAnalysisSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
    margin-left: 30px;
    margin-right: 30px;
`;

// important
const AudioFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  width: 100%;
  text-align: center;
  border: 1px solid grey;
`;

const Feature = styled.div`
    border: 1px solid grey;
    padding: 15px;
`;

const FeatureText = styled.h4`
  color: white;
  font-size: 30px;
  font-weight: 700;
  margin-top: 0px;
  margin-bottom: 0;
`;
const FeatureLabel = styled.p`
  color: grey;
  font-size: 12px;
  margin-bottom: 0;
`;










///////////////////////////////////////////////////////////
// main component
const PopupTrack = ({ trackId, trigger, onNorm, onDim }) => {
    const [thetrackId, setTheTrackId] = useState(null);
    const [trackInfo, setTrackInfo] = useState(null);
    const [theaudioFeatures, setTheAudioFeatures] = useState(null);
    const [theaudioAnalysis, setTheAudioAnalysis] = useState(null);

    //////////////////////////////////////////
    const settleOpen = (trackId, afn, bfn) => {
        afn(trackId);
        bfn(true);
    }

    useEffect(() => {
        const fetch = async (id) => {
            if (id) {
                const { track, audioFeatures, audioAnalysis } = await getTrackInfo(id);
                setTrackInfo(track);
                setTheAudioFeatures(audioFeatures);
                setTheAudioAnalysis(audioAnalysis);
                console.log("-----", id, '--------')
                console.log(JSON.stringify(audioFeatures)); //超級久
            }
        }
        catchErrors(fetch(thetrackId))
    }, [thetrackId])


    //////////////////////////////////////////
    return (
        <Popup
            trigger={trigger}
            modal
            closeOnDocumentClick={false}
            onOpen={() => { settleOpen(trackId, setTheTrackId, onDim) }}
            onClose={onNorm}
        >
            {close => (
                <Modal>
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="content">
                        {trackInfo ? (
                            <Main>
                                <TrackIntro>
                                    <Artwork>
                                        <img src={trackInfo.album.images[0].url} alt="Album Artwork" />
                                    </Artwork>
                                    <Info>
                                        <Title> {trackInfo.name} </Title>
                                        <ArtistName>
                                            {trackInfo.artists &&
                                                trackInfo.artists.map(({ name }, i) => (
                                                    <span key={i}>
                                                        {name}
                                                        {trackInfo.artists.length > 0 && i === trackInfo.artists.length - 1 ? '' : ','}
                                                        &nbsp;
                                                    </span>
                                                ))}
                                        </ArtistName>
                                        <AlbumInfo>
                                            <a
                                                href={trackInfo.album.external_urls.spotify}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {trackInfo.album.name}
                                            </a>
                                            {' '} &middot; {getYear(trackInfo.album.release_date)}
                                        </AlbumInfo>
                                    </Info>
                                </TrackIntro>
                                <Breaker />
                                {theaudioFeatures && theaudioAnalysis && (
                                    <AudioAnalysisSection>
                                        <AudioFeatures>
                                            <Feature>
                                                <FeatureText>{formatDuration(theaudioFeatures.duration_ms)}</FeatureText>
                                                <FeatureLabel>Duration</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{parsePitchClass(theaudioFeatures.key)}</FeatureText>
                                                <FeatureLabel>Key</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioFeatures.mode === 1 ? 'Major' : 'Minor'}</FeatureText>
                                                <FeatureLabel>Modality</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{Math.round(theaudioFeatures.tempo)}</FeatureText>
                                                <FeatureLabel>Tempo (BPM)</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{trackInfo.popularity}%</FeatureText>
                                                <FeatureLabel>Popularity</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioFeatures.time_signature}</FeatureText>
                                                <FeatureLabel>Time Signature</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioAnalysis.bars.length}</FeatureText>
                                                <FeatureLabel>Bars</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioAnalysis.beats.length}</FeatureText>
                                                <FeatureLabel>Beats</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioAnalysis.sections.length}</FeatureText>
                                                <FeatureLabel>Sections</FeatureLabel>
                                            </Feature>
                                            <Feature>
                                                <FeatureText>{theaudioAnalysis.segments.length}</FeatureText>
                                                <FeatureLabel>Segments</FeatureLabel>
                                            </Feature>
                                        </AudioFeatures>
                                    </AudioAnalysisSection>
                                )
                                }

                            </Main>










                        ) :
                            (<Loader />)
                        }
                    </div>
                </Modal>
            )}
        </Popup>
    );
};

export default PopupTrack;





