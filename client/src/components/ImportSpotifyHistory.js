import { useState, useRef, useCallback } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components/macro';
import { theme } from '../styles';
import { useHistoryContext } from '../data/HistoryContext';
const { colors } = theme;


/////////////////////////////////////////////
// styled components
const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px 60px;
  color: ${colors.white};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 900;
  margin: 0 0 12px;
`;

const Lead = styled.p`
  max-width: 560px;
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0 0 8px;
`;

// numbered "how to get your data" steps
const Steps = styled.ol`
  max-width: 560px;
  text-align: left;
  margin: 24px 0 32px;
  padding-left: 22px;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.85;
  li { margin-bottom: 4px; }
  a { color: ${colors.white}; text-decoration: underline; font-weight: 700; }
`;

// the dashed drop target
const DropZone = styled.div`
  width: 100%;
  max-width: 560px;
  padding: 48px 24px;
  border: 3px dashed ${props => (props.active ? colors.offGreen : 'rgba(255,255,255,0.7)')};
  border-radius: 20px;
  background-color: ${props => (props.active ? 'rgba(30,215,96,0.12)' : 'rgba(0,0,0,0.15)')};
  cursor: ${props => (props.busy ? 'progress' : 'pointer')};
  transition: border-color 0.15s ease, background-color 0.15s ease;
  .icon { font-size: 42px; margin-bottom: 12px; }
  .big { font-size: 19px; font-weight: 800; margin-bottom: 6px; }
  .small { font-size: 13px; opacity: 0.75; }
`;

const HiddenInput = styled.input`
  display: none;
`;

// result / status card below the drop zone
const Panel = styled.div`
  width: 100%;
  max-width: 560px;
  margin-top: 24px;
  padding: 18px 22px;
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.28);
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
  .head { font-weight: 800; font-size: 15px; margin-bottom: 6px; }
  .err { color: #ffd7df; }
  ul { margin: 8px 0 0; padding-left: 20px; }
`;

const Actions = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  padding: 12px 22px;
  border-radius: 999px;
  cursor: pointer;
  border: 2px solid ${colors.white};
  background-color: ${props => (props.primary ? colors.white : 'transparent')};
  color: ${props => (props.primary ? '#F67197' : colors.white)};
  transition: opacity 0.15s ease;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const SourceTag = styled.div`
  margin-bottom: 28px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.8;
  span { color: ${colors.offGreen}; }
`;


/////////////////////////////////////////////
// Import page — drop Spotify export zip(s) to power the dashboard with your own
// data. Uploading several zips is fine: newer files overwrite older ones.
const ImportSpotifyHistory = () => {
  const { source, status, importZips, reset } = useHistoryContext();
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null); // { ok, added, replaced, skipped, errors, totals }
  const inputRef = useRef(null);

  const busy = status === 'importing';

  const handleFiles = useCallback(
    async (fileList) => {
      if (!fileList || !fileList.length || busy) return;
      const res = await importZips(fileList);
      setResult(res);
    },
    [importZips, busy]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onReset = useCallback(async () => {
    await reset();
    setResult(null);
  }, [reset]);

  return (
    <Container>
      <Title>Import Spotify History</Title>
      <Lead>
        Power your dashboard with your own listening data.<br/>
        Request your Extended Streaming History from Spotify, then drop the zip below.
      </Lead>

      <Steps>
        <li>
          Go to{' '}
          <a href="https://www.spotify.com/account/privacy/" target="_blank" rel="noreferrer">
            Spotify → Privacy settings
          </a>{' '}
          and request your <b>Extended streaming history</b>.
        </li>
        <li>Spotify emails you a download link after a few days.</li>
        <li>
          Download <b>Spotify Account Data.zip</b> — no need to unzip it yourself.
        </li>
        <li>Drop the zip (or several) below.</li>
      </Steps>

      <SourceTag>
        Dashboard is currently showing{' '}
        <span>{source === 'imported' ? 'your imported data' : 'demo data'}</span>
      </SourceTag>

      <DropZone
        active={dragging}
        busy={busy}
        onClick={() => !busy && inputRef.current && inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="icon">{busy ? '⏳' : '📥'}</div>
        <div className="big">
          {busy ? 'Processing your history…' : 'Drag & drop your Spotify zip here'}
        </div>
        <div className="small">
          {busy ? 'This can take a moment for a full export.' : 'or click to choose a file · .zip only · multiple allowed'}
        </div>
      </DropZone>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept=".zip,application/zip"
        multiple
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />

      {result && (
        <Panel>
          {result.ok ? (
            <>
              <div className="head">Import complete 🎉</div>
              <div>
                {result.added} new file{result.added === 1 ? '' : 's'} added
                {result.replaced > 0 && `, ${result.replaced} updated with newer data`}
                {result.skipped > 0 && `, ${result.skipped} skipped (older than what you already had)`}.
              </div>
              {result.totals && (
                <div>
                  Now analysing <b>{result.totals.plays.toLocaleString()}</b> plays ·{' '}
                  <b>{result.totals.hours.toLocaleString()}</b> hours.
                </div>
              )}
            </>
          ) : (
            <div className="head err">Couldn’t import that.</div>
          )}
          {result.errors && result.errors.length > 0 && (
            <ul className="err">
              {result.errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Actions>
        <Button primary onClick={() => navigate('/')}>
          Go to dashboard
        </Button>
        {source === 'imported' && (
          <Button onClick={onReset} disabled={busy}>
            Clear imported data
          </Button>
        )}
      </Actions>
    </Container>
  );
};

export default ImportSpotifyHistory;
