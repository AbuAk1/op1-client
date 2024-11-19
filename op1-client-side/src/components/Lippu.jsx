import React from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
// import { QRCode } from 'qrcode.react';

import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';


export const Lippu = ({ lippu }) => {
    //console.log(lippu.koodi);
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

        <ListItem>
        <QRCodeSVG value={lippu.koodi} size={256} fgColor="#000000" bgColor="#ffffff" />
        {/* <QRCodeSVG value={"https://dev.to/onlyoneerin/creating-dynamic-qr-codes-using-reactjs-a-step-by-step-tutorial-341a"} size={256} fgColor="#000000" bgColor="#ffffff" /> */}


        </ListItem>
      </List>
    </Paper>
  );
};

export default Lippu;
