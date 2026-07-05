import { useState, useMemo } from 'react';
// css
import styled from 'styled-components/macro';
import { Main } from '../styles';
// aggregated Extended Streaming History — bundled demo, or the user's imported zip
import { useHistory } from '../data/HistoryContext';


/////////////////////////////////
// palette (requested)
//   text  #FFFCEC
//   base  #95CACA
//   bar   #336666
const TEXT = '#FFFCEC';
const BASE = '#95CACA';
const BAR = '#336666';
const PEAK = '#F75000'; // colour of the peak-hour spoke

// darken a hex colour (for the hovered spoke)
const darken = (hex, f = 0.8) => {
    const rgb = [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * f));
    return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// clock geometry (SVG user units)
const SIZE = 460;
const C = SIZE / 2;      // centre
const R0 = 60;           // hub radius — bars start here
const MAX_BAR = 120;     // radial length that maps to SCALE_MAX minutes
const LABEL_R = R0 + MAX_BAR + 18;

// FIXED absolute scale: a spoke reaching the outer ring == SCALE_MAX min/day.
// Longer listening than this is capped there (keeps the urchin harmonious).
const SCALE_MAX = 30;          // minutes / day
const RINGS = [10, 20, 30];    // labelled guide rings (minutes)
const minToRadius = min => R0 + Math.min(min / SCALE_MAX, 1) * MAX_BAR;

// Midnight (0) sits at the top like a 24-hour analog clock, hours run clockwise.
const angleOf = hour => (-90 + hour * 15) * (Math.PI / 180);
const point = (hour, radius) => [
    C + radius * Math.cos(angleOf(hour)),
    C + radius * Math.sin(angleOf(hour)),
];

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

// Merge a set of month cells into one { hourMinutes[24], activeDays, hours }.
// Used for the whole-year and all-time distributions. Months never overlap in
// days, so summing activeDays is exact.
const aggregate = (months) => {
    const hourMinutes = new Array(24).fill(0);
    let activeDays = 0;
    let hours = 0;
    months.forEach(m => {
        m.hourMinutes.forEach((v, i) => { hourMinutes[i] += v; });
        activeDays += m.activeDays;
        hours += m.hours;
    });
    return { hourMinutes, activeDays, hours: Math.round(hours) };
};


/////////////////////////////////
// styled components
const Body = styled.div`
    background-color: ${BASE};
    color: ${TEXT};
    /* Ubuntu webfont (loaded in public/index.html); cascades into the SVG text too */
    font-family: 'Ubuntu', 'Segoe UI', Tahoma, sans-serif;
    padding-bottom: 190px;
    svg text { font-family: inherit; }
`;

const Title = styled.h1`
    grid-column: 2;
    padding-top: 20px;
    margin-top: 0;
    font-size: 45px;
    font-weight: 900;
    color: ${TEXT};
`;

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    text-align: center;
    margin: 0 0 40px;
    font-weight: 600;
    letter-spacing: 1px;
    opacity: 0.85;
`;

const Layout = styled.div`
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 40px;
    margin: 0 100px;
    align-items: center;
`;

const ClockWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    svg { width: 100%; max-width: 540px; height: auto; }
`;

// white readout under the clock, shown while hovering a spoke
const Readout = styled.div`
    margin-top: 12px;
    min-height: 22px;
    text-align: center;
    color: #ffffff;
    font-weight: 700;
    letter-spacing: 0.5px;
    b { font-weight: 900; }
`;

// right-hand selector + stats
const Panel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 26px;
`;

const PanelLabel = styled.div`
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.75;
    margin-bottom: 10px;
`;

const Chips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

// shared pill button for year + month
const Chip = styled.button`
    font-family: inherit;
    border: 1.5px solid ${TEXT};
    border-radius: 999px;
    padding: ${props => (props.small ? '6px 0' : '7px 14px')};
    width: ${props => (props.small ? '58px' : 'auto')};
    text-align: center;
    font-size: 14px;
    font-weight: 800;
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    background-color: ${props => (props.active ? TEXT : 'transparent')};
    /* active = dark number on the light pill (stays legible); inactive = cream text */
    color: ${props => (props.active ? '#111' : TEXT)};
    opacity: ${props => (props.disabled ? 0.28 : 1)};
    transition: background-color 0.15s ease, color 0.15s ease;
    &:hover {
        background-color: ${props =>
            props.disabled ? 'transparent'
                : props.active ? '#EDE9D6' /* slightly darker cream so hover shows, number still dark */
                    : 'rgba(255,252,236,0.18)'};
        color: ${props => (props.active ? '#111' : TEXT)};
    }
`;

// prominent full-width button for the all-time distribution
const AllBtn = styled.button`
    font-family: inherit;
    width: 100%;
    border: 1.5px solid ${TEXT};
    border-radius: 12px;
    padding: 12px;
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 1px;
    cursor: pointer;
    background-color: ${props => (props.active ? TEXT : 'transparent')};
    color: ${props => (props.active ? BAR : TEXT)};
    transition: background-color 0.15s ease, color 0.15s ease;
    &:hover { background-color: ${props => (props.active ? TEXT : 'rgba(255,252,236,0.18)')}; }
`;

// a headline stat block (year total / month total)
const Stat = styled.div`
    margin-top: 12px;
    background-color: ${BAR};
    border-radius: 14px;
    padding: 14px 18px;
    .k { font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.75; }
    .v { font-size: 26px; font-weight: 900; margin-top: 2px; }
    .sub { font-size: 13px; opacity: 0.85; margin-top: 2px; }
`;


/////////////////////////////////
// main component
const ListeningClock = ({ refPlace }) => {
    const history = useHistory();
    const [sel, setSel] = useState(() => latestMonth(history.monthly));
    // scope of the distribution shown: whole history / whole year / single month
    const [scope, setScope] = useState('month'); // 'all' | 'year' | 'month'
    const [hoverHour, setHoverHour] = useState(null);

    const yearRow = useMemo(
        () => history.monthly.find(r => r.year === sel.year) || history.monthly[0],
        [history, sel.year]
    );

    // distributions for the two new scopes, memoised
    const allTime = useMemo(
        () => aggregate(history.monthly.flatMap(r => r.months)),
        [history]
    );
    const yearAgg = useMemo(() => aggregate(yearRow.months), [yearRow]);

    // the cell driving the clock, per the active scope
    const cell =
        scope === 'all' ? allTime :
        scope === 'year' ? yearAgg :
        yearRow.months[sel.month];

    const periodLabel =
        scope === 'all' ? 'All Time' :
        scope === 'year' ? `${sel.year}` :
        `${MONTHS[sel.month]} ${sel.year}`;

    // average minutes listened in each hour, per active day of the period
    const perDay = useMemo(() => {
        const days = cell.activeDays || 1;
        return cell.hourMinutes.map(min => Math.round((min / days) * 10) / 10);
    }, [cell]);

    const peakHour = perDay.indexOf(Math.max(...perDay));

    const pickYear = year => { setScope('year'); setSel(s => ({ ...s, year })); };
    const pickMonth = month => {
        // clicking the already-selected month again toggles back to the whole year
        if (scope === 'month' && sel.month === month) {
            setScope('year');
        } else {
            setScope('month');
            setSel(s => ({ ...s, month }));
        }
    };


    return (
        <Main>
            <Body>
                <HeaderRow>
                    <Title id="listeningclock" ref={refPlace}> Listening Timeline </Title>
                </HeaderRow>
                <Subtitle>
                    A day in sound — average minutes listened each hour (per active day). Outer ring = {SCALE_MAX} min.
                </Subtitle>

                <Layout>
                    <ClockWrap>
                        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Listening clock">
                            {/* labelled guide rings — make the length scale unambiguous */}
                            {RINGS.map(r => (
                                <g key={r}>
                                    <circle cx={C} cy={C} r={minToRadius(r)}
                                        fill="none" stroke={TEXT} strokeOpacity="0.22" strokeWidth="1" />
                                    <text x={C + 4} y={C - minToRadius(r)}
                                        fill={TEXT} fillOpacity="0.7" fontSize="11" fontWeight="700"
                                        textAnchor="start" dominantBaseline="central">
                                        {r}m
                                    </text>
                                </g>
                            ))}

                            {/* 24 hour bars — the peak hour gets its own colour */}
                            {perDay.map((v, h) => {
                                const [x1, y1] = point(h, R0);
                                const [x2, y2] = point(h, minToRadius(v));
                                const isPeak = h === peakHour && v > 0;
                                const isHover = h === hoverHour && v > 0;
                                const base = isPeak ? PEAK : BAR;
                                return (
                                    <line
                                        key={h}
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke={isHover ? darken(base) : base}
                                        strokeOpacity={isPeak || isHover ? 1 : 0.82}
                                        strokeWidth={isHover || isPeak ? 13 : 10}
                                        strokeLinecap="round"
                                        style={{ cursor: v > 0 ? 'pointer' : 'default', transition: 'stroke-width 0.12s ease' }}
                                        onMouseEnter={() => v > 0 && setHoverHour(h)}
                                        onMouseLeave={() => setHoverHour(null)}
                                    />
                                );
                            })}

                            {/* crown + label marking the peak-hour spoke */}
                            {perDay[peakHour] > 0 && (() => {
                                const tip = minToRadius(perDay[peakHour]);
                                const [cx, cy] = point(peakHour, tip + 15);
                                const [tx, ty] = point(peakHour, tip + 30);
                                return (
                                    <g style={{ pointerEvents: 'none' }}>
                                        <text x={cx} y={cy} fontSize="18"
                                            textAnchor="middle" dominantBaseline="central">👑</text>
                                        <text x={tx} y={ty} fill={PEAK} fontSize="10" fontWeight="800"
                                            letterSpacing="0.5"
                                            textAnchor="middle" dominantBaseline="central">peak hour</text>
                                    </g>
                                );
                            })()}

                            {/* hour labels around the dial (0 = midnight at top) */}
                            {Array.from({ length: 24 }, (_, h) => {
                                const [lx, ly] = point(h, LABEL_R);
                                return (
                                    <text key={h} x={lx} y={ly}
                                        fill={TEXT} fillOpacity="0.85"
                                        fontSize="13" fontWeight="700"
                                        textAnchor="middle" dominantBaseline="central">
                                        {h}
                                    </text>
                                );
                            })}

                            {/* centre hub readout */}
                            <circle cx={C} cy={C} r={R0} fill={BAR} />
                            <text x={C} y={C - 12} fill={TEXT} fontSize="20" fontWeight="900"
                                textAnchor="middle" dominantBaseline="central">
                                {periodLabel}
                            </text>
                            <text x={C} y={C + 12} fill={TEXT} fillOpacity="0.85" fontSize="12"
                                textAnchor="middle" dominantBaseline="central">
                                {cell.hours.toLocaleString()} hrs · {cell.activeDays.toLocaleString()} days
                            </text>
                        </svg>

                        <Readout>
                            {hoverHour != null && perDay[hoverHour] > 0 && (
                                <>
                                    <b>{periodLabel} · {String(hoverHour).padStart(2, '0')}:00</b>
                                    {' '}· listened: {perDay[hoverHour]} min
                                </>
                            )}
                        </Readout>
                    </ClockWrap>

                    <Panel>
                        {/* whole-history distribution */}
                        <AllBtn active={scope === 'all'} onClick={() => setScope('all')}>
                            🌐 All Time
                        </AllBtn>

                        {/* whole-year distribution — click a year */}
                        <div>
                            <PanelLabel>Year · click for the whole year</PanelLabel>
                            <Chips>
                                {history.monthly.map(row => (
                                    <Chip
                                        key={row.year}
                                        active={scope !== 'all' && row.year === sel.year}
                                        onClick={() => pickYear(row.year)}
                                    >
                                        {row.year}
                                    </Chip>
                                ))}
                            </Chips>
                        </div>

                        {/* single-month distribution */}
                        <div>
                            <PanelLabel>Month · click again for the whole year</PanelLabel>
                            <Chips>
                                {MONTHS.map((m, i) => {
                                    const has = yearRow.months[i].plays > 0;
                                    return (
                                        <Chip
                                            key={m}
                                            small
                                            active={scope === 'month' && i === sel.month}
                                            disabled={!has}
                                            onClick={() => has && pickMonth(i)}
                                        >
                                            {m}
                                        </Chip>
                                    );
                                })}
                            </Chips>
                        </div>

                        {/* totals for whatever is currently shown */}
                        <Stat>
                            <div className="k">Now showing</div>
                            <div className="v">{cell.hours.toLocaleString()} hrs</div>
                            <div className="sub">{periodLabel} · {cell.activeDays.toLocaleString()} listening days</div>
                        </Stat>
                    </Panel>
                </Layout>
            </Body>
        </Main>
    );
};

export default ListeningClock;
