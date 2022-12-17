import { createGlobalStyle } from 'styled-components/macro';
import theme from './theme';
const { colors, fontSizes, fonts } = theme;
import fontFace from './fontFace';

const GlobalStyle = createGlobalStyle`
  ${fontFace};

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }

  body {
    min-height: 100%;
    overflow-x: hidden;
    font-family: ${fonts.primary};
    background-color: ${colors.white};
    color: ${colors.black};
  }

  #root {
    min-height: 100%;
  }

  h1, h2, h3 {
    font-weight: 900;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  img {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  svg {
    fill: currentColor;
    vertical-align: middle;
  }


  button {
    display: inline-block;
    color: ${colors.lightestGrey};
    font-family: ${fonts.primary};
    font-size: ${fontSizes.base};
    font-weight: 700;
    border-radius: 50px;
    border: 0;
    padding: 10px 20px;
    cursor: pointer;

    &:hover,
    &:focus {
      color: ${colors.white};
      outline: 0;
    }
  }
`;

export default GlobalStyle;
