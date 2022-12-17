// ref: https://v5.reactrouter.com/web/guides/scroll-restoration

import { useEffect } from 'react';

const ScrollToTheTop = ({ children, location }) => {
  
  useEffect(() =>
    window.scrollTo(0, 0)
    ,[location.pathname]);

  return children;
};

export default ScrollToTheTop;