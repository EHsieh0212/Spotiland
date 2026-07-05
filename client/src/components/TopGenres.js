import { useState, useRef, useCallback } from 'react';
// css
import styled, { keyframes } from 'styled-components/macro';
import { Main } from '../styles';
// genre lives on the Spotify artist object — search returns it (with plays we
// already have per year, we can weight genres by listening).
import { searchArtist, bestArtistMatch } from '../spotify';
// aggregated Extended Streaming History — bundled demo, or the user's imported zip
import { useHistory } from '../data/HistoryContext';


/////////////////////////////////
// palette (requested)
//   base   #FFE6D9
//   others #EA7500 (top1) · #D9B300 (top2) · #FFE66F (top3)
const BASE = '#FFE6D9';
const C1 = '#EA7500';
const C2 = '#D9B300';
const C3 = '#FFE66F';
const INK = '#5A2E00';

const GENRE_TOP_N = 6; // how many genres the flag shows

const titleCase = s =>
    s.replace(/\b\w/g, c => c.toUpperCase());

// interpolate the 3-stop palette (#EA7500 → #D9B300 → #FFE66F) into N stripe
// colours, so a longer flag still runs deep-orange (top1) → pale-yellow.
const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = rgb => '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const GRAD = [C1, C2, C3].map(hexToRgb);
const stripeColor = (i, n) => {
    if (n <= 1) return C1;
    const seg = (i / (n - 1)) * (GRAD.length - 1); // 0 … 2 across the flag
    const k = Math.min(Math.floor(seg), GRAD.length - 2);
    const f = seg - k;
    return rgbToHex(GRAD[k].map((c, ch) => c + (GRAD[k + 1][ch] - c) * f));
};


/////////////////////////////////
// styled components
const Body = styled.div`
    background-color: ${BASE};
    color: ${INK};
    padding-bottom: 190px;
`;

const Title = styled.h1`
    text-align: center;
    padding-top: 20px;
    margin: 0;
    font-size: 45px;
    font-weight: 900;
    color: ${C1};
`;

const Subtitle = styled.p`
    text-align: center;
    margin: 6px 0 44px;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${INK};
    opacity: 0.7;
`;

// the whole scene — vertical bar on the left, flags fly out to the right
const Stage = styled.div`
    position: relative;
    width: 720px;
    max-width: calc(100% - 200px);
    height: 560px;
    margin: 0 auto;
`;

// one big vertical bar, 2017 at the bottom → 2026 at the top
const Bar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 118px;
    display: flex;
    flex-direction: column-reverse; /* first child (2017) sits at the bottom */
    border-radius: 14px;
    overflow: visible;
    box-shadow: rgba(90, 46, 0, 0.25) 0 6px 18px -6px;
`;

const Segment = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 900;
    color: #fff;
    cursor: pointer;
    background-color: ${props => (props.active ? C2 : C1)};
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.35);
    transition: background-color 0.15s ease;
    &:first-child { border-radius: 0 0 14px 14px; }
    &:last-child  { border-radius: 14px 14px 0 0; }
`;

// gentle flutter — anchored at the pole (left), far end sways more
const wave = keyframes`
    0%, 100% { transform: translateY(-50%) skewY(-1.6deg) rotate(-0.5deg); }
    50%      { transform: translateY(-50%) skewY(1.6deg) rotate(0.5deg); }
`;

const Flag = styled.div`
    position: absolute;
    left: calc(100% + 14px);
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
    display: flex;
    height: 48px;
    width: 610px;
    max-width: 56vw;
    border-radius: 3px;
    overflow: hidden;
    /* swallowtail right edge so it reads as a flag flying right */
    clip-path: polygon(0 0, 100% 0, 93% 50%, 100% 100%, 0 100%);
    box-shadow: rgba(90, 46, 0, 0.28) 0 6px 14px -6px;
    animation: ${wave} 2.4s ease-in-out infinite;
    z-index: 3;
`;

// short pole where the flag meets the bar
const Pole = styled.div`
    position: absolute;
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 68px;
    border-radius: 3px;
    background: ${INK};
    z-index: 2;
`;

const Stripe = styled.div`
    /* the last stripe is wider so its text clears the swallowtail notch */
    flex: ${props => (props.last ? 1.9 : 1)};
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 5px;
    padding-right: ${props => (props.last ? '48px' : '5px')};
    text-align: center;
    border-right: 1px solid rgba(90, 46, 0, 0.12);
    background-color: ${props => props.color};
    color: ${INK};
    &:last-child { border-right: 0; }
    .g { font-size: 12px; font-weight: 900; line-height: 1.1; }
    .r { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; opacity: 0.65; margin-top: 2px; }
`;

// single-cell flag used for loading / empty states
const FlagNote = styled(Flag)`
    align-items: center;
    justify-content: center;
    background-color: ${C3};
    color: ${INK};
    font-weight: 800;
    font-size: 14px;
    animation: ${wave} 2.4s ease-in-out infinite;
`;

const Hint = styled.p`
    position: absolute;
    left: 150px;
    top: 50%;
    transform: translateY(-50%);
    color: ${INK};
    opacity: 0.55;
    font-weight: 700;
    font-size: 15px;
`;


/////////////////////////////////
// main component
const TopGenres = ({ refPlace }) => {
    const history = useHistory();
    const years = history.monthly.map(r => r.year); // ascending (2017 … 2026)
    const [hoverYear, setHoverYear] = useState(null);
    const [topByYear, setTopByYear] = useState({}); // year -> [{ genre, score }]
    const [loadingYear, setLoadingYear] = useState(null);
    // artist name -> genres[] (deduped across years so each artist is fetched once)
    const genreCache = useRef({});

    const loadYear = useCallback(async (year) => {
        if (topByYear[year]) return; // already computed
        const row = history.monthly.find(r => r.year === year);
        const singers = row.topSingers || [];
        setLoadingYear(year);
        try {
            await Promise.all(
                singers.map(s => {
                    if (genreCache.current[s.name] !== undefined) return null;
                    return searchArtist(s.name)
                        .then(r => {
                            const item = bestArtistMatch(r.data.artists.items, s.name);
                            genreCache.current[s.name] = item ? item.genres : [];
                        })
                        .catch(() => { genreCache.current[s.name] = []; });
                })
            );
            // weight each genre by the plays of the artists carrying it
            const score = {};
            singers.forEach(s => {
                (genreCache.current[s.name] || []).forEach(g => {
                    score[g] = (score[g] || 0) + s.plays;
                });
            });
            const top = Object.entries(score)
                .sort((a, b) => b[1] - a[1])
                .slice(0, GENRE_TOP_N)
                .map(([genre, sc]) => ({ genre, score: sc }));
            setTopByYear(prev => ({ ...prev, [year]: top }));
        } finally {
            setLoadingYear(null);
        }
    }, [history, topByYear]);

    const onHover = year => {
        setHoverYear(year);
        loadYear(year);
    };

    const renderFlag = year => {
        const data = topByYear[year];
        if (loadingYear === year && !data) {
            return <FlagNote>loading genres…</FlagNote>;
        }
        if (data && data.length === 0) {
            return <FlagNote>no genre data</FlagNote>;
        }
        if (!data) return null;
        return (
            <>
                <Pole />
                <Flag>
                    {data.map((d, i) => (
                        <Stripe key={d.genre} color={stripeColor(i, data.length)} last={i === data.length - 1}>
                            <span className="g">{titleCase(d.genre)}</span>
                            <span className="r">#{i + 1}</span>
                        </Stripe>
                    ))}
                </Flag>
            </>
        );
    };

    return (
        <Main>
            <Body>
                <Title id="topgenres" ref={refPlace}> Top Genres </Title>
                <Subtitle>
                    Hover a year — the flag flies out with that year’s top {GENRE_TOP_N} genres (most → least, left → right)
                </Subtitle>

                <Stage onMouseLeave={() => setHoverYear(null)}>
                    <Bar>
                        {years.map(year => (
                            <Segment
                                key={year}
                                active={hoverYear === year}
                                onMouseEnter={() => onHover(year)}
                            >
                                {year}
                                {hoverYear === year && renderFlag(year)}
                            </Segment>
                        ))}
                    </Bar>
                    {hoverYear === null && <Hint>← hover a year</Hint>}
                </Stage>
            </Body>
        </Main>
    );
};

export default TopGenres;
