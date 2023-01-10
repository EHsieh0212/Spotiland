import * as React from 'react';
import { forwardRef } from "react";
import styled from 'styled-components/macro';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeGrid as Grid } from "react-window";
import { FixedSizeList } from 'react-window';




//////////////////////////////////////////////////////////////////////////////
// styled component









//////////////////////////////////////////////////////////////////////////////
const RenderRow = (props) => {
  const { index, style } = props;
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}






//////////////////////////////////////////////////////////////////////////////
// main component
const HappinessTrackList = () => {
  return (
    <Box
      sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={200}
        overscanCount={5}
      >
        {RenderRow}
      </FixedSizeList>
    </Box>
  );
}

export default HappinessTrackList;