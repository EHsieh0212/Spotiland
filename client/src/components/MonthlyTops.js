import { useState, useEffect, useMemo, useCallback } from 'react';
// css
import styled, { keyframes, css } from 'styled-components/macro';
import { Main } from '../styles';
// api enrichment (artwork) — the ranking itself comes from the local export
import { getTracksByIds, searchArtist, bestArtistMatch } from '../spotify';
// artist-detail popup (same one the old TopSingers used)
import PopupArtist2 from './PopupArtist2';
// aggregated Extended Streaming History — bundled demo, or the user's imported zip
import { useHistory } from '../data/HistoryContext';


/////////////////////////////////
// palette — mid grey so the artwork pops (easy to restyle)
const BG = '#6C6C6C';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.55)';
const CARD = '#242424';
const ACCENT = '#1DB954'; // Spotify green — active chip / play counts

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const keyOf = (y, m) => `${y}-${m}`;

// Most recent month that has any listening → default view (e.g. Jun 2026).
const latestMonth = (monthly) => {
    for (let y = monthly.length - 1; y >= 0; y--) {
        const row = monthly[y];
        for (let m = 11; m >= 0; m--) {
            if (row.months[m].plays > 0) return { year: row.year, month: m };
        }
    }
    return { year: monthly[0] ? monthly[0].year : 0, month: 0 };
};

const smallest = images => (images && images.length ? images[images.length - 1].url : null);


/////////////////////////////////
// styled components
const Body = styled.div`
    position: relative;
    background-color: ${BG};
    color: ${TEXT};
    font-family: 'Courier New', Courier, monospace;
    padding-bottom: 190px;
    /* Foggy-white veil over the whole section while an artist popup is open,
       so the modal content stands out. */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: rgba(255, 255, 255, 0.75);
        opacity: ${props => (props.dim ? 1 : 0)};
        transition: opacity 0.25s ease;
        pointer-events: none;
        z-index: 4;
    }
`;

const Title = styled.h1`
    text-align: center;
    padding-top: 20px;
    margin: 0;
    font-size: 45px;
    font-weight: 900;
`;

const Subtitle = styled.p`
    text-align: center;
    margin: 6px 0 30px;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${MUTED};
`;

// year + month selector
const Selector = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 0 100px 40px;
`;

// year picker drawn as a horizontal line studded with year nodes
const Timeline = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 6px 0 4px;
    /* the connecting line — sits at the vertical centre of the 16px dots */
    &::before {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 7px;
        height: 2px;
        background: rgba(255, 255, 255, 0.45);
    }
`;

const Node = styled.button`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: ${TEXT};
    font-family: inherit;
    .yr {
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 8px;
        opacity: ${props => (props.active ? 1 : 0.7)};
        color: ${props => (props.active ? ACCENT : TEXT)};
    }
    .dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${props => (props.active ? ACCENT : '#d0d0d0')};
        border: 2px solid ${BG};
        box-shadow: 0 0 0 2px ${props => (props.active ? ACCENT : 'rgba(255,255,255,0.55)')};
        transition: background 0.15s ease, box-shadow 0.15s ease;
    }
    &:hover .dot { box-shadow: 0 0 0 2px ${ACCENT}; }
`;

// ── the month picker, drawn as a little train ────────────────────────────
const spin = keyframes`
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
`;
// a smoke puff rising and fading out of the chimney
const puff = keyframes`
    0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
    20%  { opacity: 0.85; }
    100% { transform: translate(7px, -28px) scale(1.6); opacity: 0; }
`;

// shared body + wheels for both the locomotive and the carriages
const carBase = css`
    position: relative;
    flex: 0 0 auto;
    height: 44px;
    border: 2px solid #2b2b2b;
    color: #fff;
    font-family: inherit;
    font-weight: 800;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* two spinning wheels under the body */
    .wheel {
        position: absolute;
        bottom: -11px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #1c1c1c;
        border: 2px solid #9a9a9a;
        animation: ${spin} 1.1s linear infinite;
    }
    .wheel::before {
        content: '';
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 5.5px;
        width: 1.5px;
        background: #9a9a9a;
    }
    .wheel.left  { left: 9px; }
    .wheel.right { right: 9px; }
    &:disabled { opacity: 0.3; cursor: default; }
    &:disabled .wheel { animation-play-state: paused; }
`;

const Loco = styled.button`
    ${carBase}
    width: 84px;
    border-radius: 16px 6px 3px 8px;
    background: ${props => (props.active ? ACCENT : '#333')};
    color: ${props => (props.active ? '#0a0a0a' : '#fff')};
    /* chimney */
    .chimney {
        position: absolute;
        top: -12px;
        left: 14px;
        width: 12px;
        height: 14px;
        border-radius: 3px 3px 0 0;
        background: #2b2b2b;
    }
    /* smoke puffs */
    .smoke {
        position: absolute;
        top: -20px;
        left: 15px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.85);
        animation: ${puff} 1.8s ease-out infinite;
    }
    .smoke.s2 { animation-delay: 0.6s; }
    .smoke.s3 { animation-delay: 1.2s; }
`;

const Carriage = styled.button`
    ${carBase}
    width: 60px;
    border-radius: 6px 6px 3px 3px;
    background: ${props => (props.active ? ACCENT : '#4a4a4a')};
    color: ${props => (props.active ? '#0a0a0a' : '#fff')};
    /* coupler that hitches this car to the one on its left */
    &::after {
        content: '';
        position: absolute;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 4px;
        background: #2b2b2b;
        z-index: -1;
    }
`;

const Train = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 14px;
    width: 100%;
    padding: 26px 0 16px; /* headroom for smoke above, wheels below */
    overflow-x: auto;
`;

const Columns = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin: 0 100px;
    align-items: start;
`;

const ColTitle = styled.h2`
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 1px;
    margin: 0 0 16px;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: ${props => (props.loading ? 0.35 : 1)};
    transition: opacity 0.2s ease;
`;

const Row = styled.div`
    display: grid;
    grid-template-columns: 26px 52px 1fr auto;
    align-items: center;
    gap: 14px;
    background-color: ${CARD};
    border-radius: 10px;
    padding: 8px 14px;
    .rank { font-size: 16px; font-weight: 900; color: ${MUTED}; text-align: center; }
    .art  { width: 52px; height: 52px; object-fit: cover; background: #333; }
    .artist-art { border-radius: 50%; }
    .name { font-weight: 800; font-size: 15px; line-height: 1.25; }
    .by   { color: ${MUTED}; font-size: 12px; margin-top: 2px; }
    .plays { text-align: right; font-weight: 900; font-size: 15px; color: ${ACCENT}; }
    .plays small { display: block; color: ${MUTED}; font-weight: 600; font-size: 10px; letter-spacing: 1px; }
`;

// hover "info" mask over a singer avatar — doubles as the popup trigger
const Mask = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s ease;
`;

// relative wrapper so the mask can sit exactly over the 52px avatar
const Avatar = styled.div`
    position: relative;
    width: 52px;
    height: 52px;
    &:hover ${Mask} { opacity: 1; }
`;

// placeholder square/circle when artwork is missing or still loading
const Ph = styled.div`
    width: 52px;
    height: 52px;
    border-radius: ${props => (props.round ? '50%' : '2px')};
    background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: ${MUTED};
`;

const Note = styled.p`
    text-align: center;
    color: ${MUTED};
    font-size: 13px;
    margin: 24px 100px 0;
`;


/////////////////////////////////
// main component
const MonthlyTops = ({ refPlace }) => {
    const history = useHistory();
    const [sel, setSel] = useState(() => latestMonth(history.monthly));
    // artwork cache keyed by "year-month": { singers:{name:url}, tracks:{id:url} }
    const [art, setArt] = useState({});
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [dim, setDim] = useState(false); // foggy-white veil while a popup is open

    const yearRow = useMemo(
        () => history.monthly.find(r => r.year === sel.year) || history.monthly[0],
        [history, sel.year]
    );
    // sel.month === 'all' → whole-year charts (the locomotive)
    const isAll = sel.month === 'all';
    const cell = isAll
        ? { topSingers: yearRow.topSingers || [], topTracks: yearRow.topTracks || [] }
        : yearRow.months[sel.month];
    const cacheKey = keyOf(sel.year, sel.month); // "2020-all" or "2020-6"
    const periodLabel = isAll ? `All ${sel.year}` : `${MONTHS[sel.month]} ${sel.year}`;

    const enrich = useCallback(async () => {
        if (art[cacheKey]) return; // already fetched
        setLoading(true);
        setFailed(false);
        try {
            const ids = cell.topTracks.map(t => t.id);
            const tracksP = ids.length
                ? getTracksByIds(ids)
                : Promise.resolve({ data: { tracks: [] } });
            const singersP = Promise.all(
                cell.topSingers.map(s =>
                    searchArtist(s.name)
                        .then(r => bestArtistMatch(r.data.artists.items, s.name))
                        .catch(() => null)
                )
            );
            const [tracksRes, singerHits] = await Promise.all([tracksP, singersP]);

            const tracks = {};
            (tracksRes.data.tracks || []).forEach(t => {
                if (t) tracks[t.id] = smallest(t.album.images);
            });
            const singers = {};
            cell.topSingers.forEach((s, i) => {
                const hit = singerHits[i];
                // keep the artist id too so the card can open an artist popup
                singers[s.name] = { url: hit ? smallest(hit.images) : null, id: hit ? hit.id : null };
            });

            setArt(prev => ({ ...prev, [cacheKey]: { tracks, singers } }));
        } catch (e) {
            // token expired / offline — keep the text ranking, drop the artwork
            console.error('MonthlyTops artwork fetch failed:', e);
            setFailed(true);
        } finally {
            setLoading(false);
        }
    }, [art, cacheKey, cell]);

    useEffect(() => {
        enrich();
    }, [enrich]);

    const pick = (year, month) => {
        if (month === 'all') { setSel({ year, month: 'all' }); return; }
        const row = history.monthly.find(r => r.year === year);
        if (row.months[month] && row.months[month].plays > 0) {
            setSel({ year, month });
        } else {
            let best = 0;
            row.months.forEach((m, i) => { if (m.plays > row.months[best].plays) best = i; });
            setSel({ year, month: best });
        }
    };

    const cached = art[cacheKey] || { tracks: {}, singers: {} };
    const initial = str => (str ? str.charAt(0).toUpperCase() : '?');

    return (
        <Main>
            <Body dim={dim}>
                <Title id="monthlytops" ref={refPlace}> Monthly Top Charts </Title>
                <Subtitle>
                    My top singers &amp; tracks for any month — or the whole year (All) — ranked by plays
                </Subtitle>

                <Selector>
                    <Timeline>
                        {history.monthly.map(row => (
                            <Node
                                key={row.year}
                                active={row.year === sel.year}
                                onClick={() => pick(row.year, sel.month)}
                            >
                                <span className="yr">{row.year}</span>
                                <span className="dot" />
                            </Node>
                        ))}
                    </Timeline>
                    <Train>
                        {/* locomotive = whole year */}
                        <Loco
                            active={isAll}
                            onClick={() => setSel({ year: sel.year, month: 'all' })}
                            title="Whole year"
                        >
                            <span className="smoke s1" />
                            <span className="smoke s2" />
                            <span className="smoke s3" />
                            <span className="chimney" />
                            All
                            <span className="wheel left" />
                            <span className="wheel right" />
                        </Loco>
                        {/* one carriage per month */}
                        {MONTHS.map((m, i) => {
                            const has = yearRow.months[i].plays > 0;
                            return (
                                <Carriage
                                    key={m}
                                    active={!isAll && i === sel.month}
                                    disabled={!has}
                                    onClick={() => has && setSel({ year: sel.year, month: i })}
                                >
                                    {m}
                                    <span className="wheel left" />
                                    <span className="wheel right" />
                                </Carriage>
                            );
                        })}
                    </Train>
                </Selector>

                <Columns>
                    {/* Top Singers */}
                    <div>
                        <ColTitle>Top Singers · {periodLabel}</ColTitle>
                        <List loading={loading}>
                            {cell.topSingers.map((s, i) => {
                                const info = cached.singers[s.name] || {};
                                return (
                                    <Row key={s.name + i}>
                                        <div className="rank">{i + 1}</div>
                                        <Avatar>
                                            {info.url
                                                ? <img className="art artist-art" src={info.url} alt={s.name} />
                                                : <Ph round>{initial(s.name)}</Ph>}
                                            {/* hover mask → opens the artist popup (only when we resolved an id) */}
                                            {info.id && (
                                                <PopupArtist2
                                                    singerId={info.id}
                                                    trigger={<Mask>info</Mask>}
                                                    onDim={() => setDim(true)}
                                                    onNorm={() => setDim(false)}
                                                />
                                            )}
                                        </Avatar>
                                        <div>
                                            <div className="name">{s.name}</div>
                                        </div>
                                        <div className="plays">{s.plays}<small>PLAYS</small></div>
                                    </Row>
                                );
                            })}
                            {cell.topSingers.length === 0 && <Note>No plays this month.</Note>}
                        </List>
                    </div>

                    {/* Top Tracks */}
                    <div>
                        <ColTitle>Top Tracks · {periodLabel}</ColTitle>
                        <List loading={loading}>
                            {cell.topTracks.map((t, i) => {
                                const url = cached.tracks[t.id];
                                return (
                                    <Row key={t.id + i}>
                                        <div className="rank">{i + 1}</div>
                                        {url
                                            ? <img className="art" src={url} alt={t.name} />
                                            : <Ph>{initial(t.name)}</Ph>}
                                        <div>
                                            <div className="name">{t.name}</div>
                                            <div className="by">{t.artist}</div>
                                        </div>
                                        <div className="plays">{t.plays}<small>PLAYS</small></div>
                                    </Row>
                                );
                            })}
                            {cell.topTracks.length === 0 && <Note>No plays this month.</Note>}
                        </List>
                    </div>
                </Columns>

                {failed && (
                    <Note>Couldn’t load artwork (login may have expired) — showing the ranking without covers.</Note>
                )}
            </Body>
        </Main>
    );
};

export default MonthlyTops;
