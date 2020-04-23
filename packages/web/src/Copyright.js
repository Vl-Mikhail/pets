import React from 'react';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';

export default function Copyright({ className }) {
  return (
    <Typography variant="body2" color="textSecondary" align="center" className={className}>
      {'Copyright © '}
      <MuiLink color="inherit" href="https://material-ui.com/">
        RUVOD
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
