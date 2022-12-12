import React from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components/macro';
import { theme, mixins, Main } from '../styles';
const { colors, fontSizes } = theme;

const FooterBack = styled(Main)`
  ${mixins.flexCenter};
  background-color: ${colors.lightGrey};
  flex-direction: column;
  min-height: 0;
  margin: 0;
`;


const FooterDiv = styled.div`
  /* display: inline-block; */
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  color: ${colors.white};
  .words{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name{
    text-align: center;
    position: relative;
    margin-left: 50px;
    margin-right: 50px;
    font-size: 20px;
  }
`;

///////////////////////////////////////////////
// Login JSX
const Footer = () => (
  <FooterBack>
    <FooterDiv>
      <hr></hr>
      <div className='words'>
        <div className='name'>© 2022. All rights reserved.</div>
        <a className='name' href='/privacy.html'>Privacy Policy</a>
      </div>
    </FooterDiv>
  </FooterBack>
);

export default Footer;