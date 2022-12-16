import React from 'react';
import styled from 'styled-components/macro';
import { mixins } from '../styles';

const Container = styled.div`
  ${mixins.flexCenter};
  width: 100%;
  height: 90vh;
`;

const Loader = () => (
  <Container>
    <div> loading </div>
  </Container>
);

export default Loader;