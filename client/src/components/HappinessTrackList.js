import * as React from 'react';
import { forwardRef } from "react";
import styled from 'styled-components/macro';
import { FixedSizeGrid as Grid } from "react-window";




//////////////////////////////////////////////////////////////////////////////
// styled component
const StyledGrid = styled(Grid)`
    background-color: rgba(221, 240, 240, 0.2);
`;

//////////////////////////////////////////////////////////////////////////////
const GUTTER_SIZE = 9;
const COLUMN_WIDTH = 200;
const ROW_HEIGHT = 80;

const Cell = ({ columnIndex, rowIndex, style }) => (
    <div
        className={"GridItem"}
        style={{
            ...style,
            left: style.left + GUTTER_SIZE,
            top: style.top + GUTTER_SIZE,
            width: style.width - GUTTER_SIZE,
            height: style.height - GUTTER_SIZE,
            color: "black",
            backgroundColor: "rgba(25, 220, 220, 0)",
        }}
    >
        r{rowIndex + 1}, c{columnIndex + 1}
    </div>
);

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
        ref={ref}
        style={{
            ...style,
            paddingLeft: GUTTER_SIZE,
            paddingTop: GUTTER_SIZE
        }}
        {...rest}
    />
));



//////////////////////////////////////////////////////////////////////////////
// main component
const HappinessTrackList = () => {
    return (
        <StyledGrid
            className="Grid"
            columnCount={3}
            columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
            height={550}
            innerElementType={innerElementType}
            rowCount={25}
            rowHeight={ROW_HEIGHT + GUTTER_SIZE}
            width={600}
            backgroundColor={"#E7F0F0"}
        >
            {Cell}
        </StyledGrid>
    )
};


export default HappinessTrackList;