import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////
// main component
const HappinessTrackList = () => {
    const [adata, setAData] = useState(null);


    const { data } = useDemoData({
      dataSet: 'Commodity',
      rowLength: 20,
    });

    
    useEffect(() => {
        setAData(data);
        console.log(adata);
    }, [])


    //////////////////////////////////////////////
    return (
        <Box sx={{ width: 550, height: 600 }}>
          <DataGrid
            hideFooter
            disableColumnMenu
            {...data}
          />
        </Box>
    );
  }




export default HappinessTrackList;