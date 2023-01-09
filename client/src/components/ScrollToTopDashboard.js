import { useState, useEffect } from "react";
import { FaAngleDoubleUp } from "react-icons/fa";
import styled from 'styled-components/macro';

//////////////////////////////////////////////////////////

const StyledFaAngleDoubleUp = styled(FaAngleDoubleUp)`
    position: fixed;
    bottom: 15px;
    right: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 2px solid #333;
    background-color: null;
    cursor: pointer;
    &:hover,
    &:focus{
        border: 0px solid;
    }
`;


//////////////////////////////////////////////////////////
const ScrollToTopDashboard = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    });
    console.log(showScrollTopButton)
  }, []);


  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div>
      {showScrollTopButton && (
        <StyledFaAngleDoubleUp
          onClick={scrollTop}
        />
      )}
    </div>
  );
};

export default ScrollToTopDashboard;