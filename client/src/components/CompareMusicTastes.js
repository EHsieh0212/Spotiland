import styled from 'styled-components/macro';
import { theme } from '../styles';
const { colors } = theme;


/////////////////////////////////////////////
// styled components
const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 0 20px;
  text-align: center;
  color: ${colors.white};
  h1 {
    font-size: 48px;
    font-weight: 700;
    margin: 0 0 16px;
  }
  p {
    max-width: 480px;
    font-size: 18px;
    opacity: 0.85;
  }
`;


/////////////////////////////////////////////
// Placeholder page — comparing tastes needs a second person's data (future work).
const CompareMusicTastes = () => (
  <Container>
    <h1>Compare Music Tastes</h1>
    <p>Coming soon — compare your top artists and tracks with a friend.</p>
  </Container>
);

export default CompareMusicTastes;
