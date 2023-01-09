import React from 'react';
import styled from 'styled-components/macro';
import { ThreeDots } from 'react-loader-spinner'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  
`;

const Loader = () => (
  <Container>
    <ThreeDots
      height="80"
      width="80"
      radius="9"
      color="#4fa94d"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
    />
  </Container>
);

export default Loader;