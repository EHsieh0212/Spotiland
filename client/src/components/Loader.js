import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
`;

const Loader = () => (
  <Container>
    <div> loading </div>
  </Container>
);

export default Loader;