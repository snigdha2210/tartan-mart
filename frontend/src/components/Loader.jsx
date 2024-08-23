// import libraries and objects
import React from 'react';
import { theme } from '././../../theme';
import CircularProgress from '@mui/material/CircularProgress';

// loader component definition
const loader = () => {
  // render Loader
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress sx={{ color: theme.primary.red }} size={100} />
    </div>
  );
};

// export loader component
export default loader;
