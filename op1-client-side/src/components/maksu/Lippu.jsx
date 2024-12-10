import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../../images/ticketguru.webp';


export default function Lippu({ lippu }) {
  return (
    <Paper elevation={2}
      style={{
        padding: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 3,
        background: 'linear-gradient(to top right, #c8dafc, #e0f4ff)'
      }} >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '20px' }}><b>Tapahtuman nimi: {lippu.tapahtuma.nimi}</b></Typography>
        </Box>
        <Box>
          <Typography variant="body1">Hintaluokka: {lippu.hinnasto.hintaluokka}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Lippumäärä: {lippu.maara}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Käytetty: {lippu.kaytetty.toString()}</Typography>
        </Box>
        <Box>
          <img
            src={logo}
            alt="description"
            style={{ width: '80px', height: '80px', marginRight: '10px' }}
          />
        </Box>
      </Box>

      <QRCodeSVG value={lippu.koodi} size={200} fgColor="#000000" bgColor="#ffffff" />
    </Paper>
  );
};