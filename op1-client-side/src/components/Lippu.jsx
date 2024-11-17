import React from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
// import { styled } from '@emotion/styled';
// import { Paper } from '@mui/material';

export const Lippu = ({ lippu }) => {
  return (
    <Paper elevation={2} style={{ margin: '10px', padding: '10px' }}>
      <List>
        <ListItem>
          <ListItemText
            primary={<Typography variant="h6">LippuId: {lippu.lippuId}</Typography>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body1">Tapahtuman nimi: {lippu.tapahtuma.nimi}</Typography>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body1">Hintaluokka: {lippu.hinnasto.hintaluokka}</Typography>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body1">Lippumäärä: {lippu.maara}</Typography>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body1">Käytetty: {lippu.kaytetty.toString()}</Typography>}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Lippu;
