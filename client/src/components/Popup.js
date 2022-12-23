// css
import styled from 'styled-components/macro';



/////////////////////////////////////////////
// styled component
const PopupBox = styled.div`
    position: fixed;
    background: grey;
    opacity: 0.25;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
`;

const Box = styled.div`
    position: relative;
    width: 70%;
    margin: 0 auto;
    height: auto;
    max-height: 70vh;
    margin-top: calc(100vh - 85vh - 20px);
    background: white;
    border-radius: 4px;
    padding: 20px;
    border: 1px solid #999;
    overflow: auto;
    .close-icon{
        content: 'x';
        cursor: pointer;
        position: fixed;
        right: calc(15% - 30px);
        top: calc(100vh - 85vh - 33px);
        background: #ededed;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        line-height: 20px;
        text-align: center;
        border: 1px solid #999;
        font-size: 20px;
    }
`;


/////////////////////////////////////////////
// component
export const Popup = props => {
    return (
      <PopupBox>
        <Box>
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </Box>
      </PopupBox>
    );
};
   

