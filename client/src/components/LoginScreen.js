import { useState, useRef, useCallback } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components/macro';
import { theme, Main } from '../styles';
import { useHistoryContext } from '../data/HistoryContext';
import Loader from './Loader';
import Footer from './Footer';
const { colors } = theme;


///////////////////////////////////////////////
// styled components (reused from the original login screen)
const Login = styled(Main)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.black};
  background-color: ${colors.white};
  flex-direction: column;
  min-height: 100vh;
  h1 {
    /* only the wordmark switches to Ubuntu; everything else stays as-is */
    font-family: 'Ubuntu', sans-serif;
    font-size: 100px;
    font-weight: 700;
    margin-bottom: 30px;
  }
`;

// small "import extended spotify file" card
const ImportBox = styled.div`
  border: 2px solid ${colors.black};
  border-radius: 16px;
  padding: 24px 28px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  .box-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .hint {
    font-size: 13px;
    line-height: 1.6;
    color: ${colors.grey};
    margin: 0;
  }
  a {
    color: ${colors.black};
    font-weight: 700;
    text-decoration: underline;
  }
`;

const ImportButton = styled.button`
  font-family: inherit;
  display: inline-block;
  background-color: ${colors.black};
  color: ${colors.white};
  border: none;
  cursor: pointer;
  border-radius: 30px;
  padding: 17px 35px;
  margin: 24px 0 70px;
  min-width: 160px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.green};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorText = styled.p`
  color: #d0021b;
  font-size: 13px;
  margin: 16px 0 0;
  max-width: 420px;
  text-align: center;
`;


///////////////////////////////////////////////
// Landing screen: Spotiland wordmark + an import card. Picking a .zip runs the
// import, shows a loader while it parses, then jumps to the dashboard.
const LoginScreen = () => {
  const { importZips } = useHistoryContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      if (!fileList || !fileList.length) return;
      setError(null);
      setLoading(true);
      const res = await importZips(fileList);
      if (res.ok) {
        navigate('/dashboard');
        return;
      }
      setLoading(false);
      setError((res.errors && res.errors[0]) || 'Could not import that file.');
    },
    [importZips]
  );

  // while parsing the export, show only the loader (no wordmark)
  if (loading) {
    return (
      <Login>
        <Loader />
      </Login>
    );
  }

  return (
    <Login>
      <h1>Spotiland</h1>
      <ImportBox>
        <div className="box-title">import extended spotify file</div>
        <p className="hint">
          Request your <b>Extended Streaming History</b> from{' '}
          <a
            href="https://www.spotify.com/account/privacy/"
            target="_blank"
            rel="noreferrer"
          >
            Spotify → Privacy settings
          </a>
          . Spotify emails you a <b>.zip</b> in a few days — import it here.
        </p>
      </ImportBox>
      {error && <ErrorText>{error}</ErrorText>}
      <ImportButton onClick={() => inputRef.current && inputRef.current.click()}>
        Import
      </ImportButton>
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
      <Footer />
    </Login>
  );
};

export default LoginScreen;
