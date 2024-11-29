import React , { useRef } from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
// import { QRCode } from 'qrcode.react';

import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';


export const Lippu = ({ lippu }) => {
    //console.log(lippu.koodi);
  return (
    <Paper elevation={2} style={{ margin: '10px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }} >
      <List>
        <ListItem>
          <ListItemText
            primary={<Typography variant="h6" sx={{ mt: 0, pt:0 }}>LippuId: {lippu.lippuId}</Typography>}
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

      <QRCodeSVG value={lippu.koodi} size={200} fgColor="#000000" bgColor="#ffffff" />
        {/* <QRCodeSVG value={"https://dev.to/onlyoneerin/creating-dynamic-qr-codes-using-reactjs-a-step-by-step-tutorial-341a"} size={256} fgColor="#000000" bgColor="#ffffff" /> */}
    </Paper>
  );
};

export default Lippu;
