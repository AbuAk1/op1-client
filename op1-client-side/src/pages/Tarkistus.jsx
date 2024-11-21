import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Typography, Box, Alert } from '@mui/material';


function Tarkistus() {

    const [lippunumero, setLippunumero] = useState("");

    const [lippuId, setLippuId] =  useState("");

    const [lippu , setLippu] = useState(null);

    const [error, setError] = useState('');

    const navigate = useNavigate();
  
    const etsi = async () => {
      console.log(lippunumero)
      
      const token = localStorage.getItem("token");

      try {

        // console.log(token);

        const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/koodi/${lippunumero}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
            console.log(data)
          setLippu(data);  
          setLippuId(data.lippuId);
        } else {
          console.error("Virhe lipun haussa");
          setLippu(null); 
          setError('Väärä koodi');
        }
      } catch (error) {
        console.error("Virhe pyynnön aikana:", error);
        setLippu(null);
        setError('On tapahtunut virhe lipun haussa')
      }
    };


    const kaytaLippu = async () => {
        console.log(lippunumero)
        const token = localStorage.getItem("token");
        try {
          // console.log(token);
          console.log(lippuId);

          const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/${lippuId}`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`, 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "kaytetty": true,}),
          });
  
          if (response.ok) {
            const data = await response.json();
              console.log(data)
            setLippu(data);  
          } else {
            console.error("Virhe lipun haussa");
            setLippu(null); 
          }
        } catch (error) {
          console.error("Virhe pyynnön aikana:", error);
          setLippu(null);
        }
      };


      
    const eikaytaLippu = async () => {
      console.log(lippunumero)
      
      const token = localStorage.getItem("token");

      try {
        // console.log(token);
        console.log(lippuId);

        const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/${lippuId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "kaytetty": false,}),
        });

        if (response.ok) {
          const data = await response.json();
            console.log(data)
          setLippu(data);  
        } else {
          console.error("Virhe lipun haussa");
          setError('virhe');
          setLippu(null); 
        }
      } catch (error) {
        console.error("Virhe pyynnön aikana:", error);
        setLippu(null);
      }
    };

    return (
      <>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            marginBottom: 2,
            zIndex: 100,
            borderRadius: '8px',
          }}
        >
          Takaisin
        </Button>
  
        <Box sx={{ marginBottom: 2, maxWidth: '500px', m: 'auto' }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Anna lippunumero: <br></br>
            1d779ffc-6f83-4d0e-bef1-eb288d85b883
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Lippunumero"
            value={lippunumero}
            onChange={(e) => setLippunumero(e.target.value)}
          />

        <Button
          variant="contained"
          color="primary"
          onClick={etsi}
          sx={{ marginTop: 2 }}
        >
          Etsi
        </Button>

  
          {lippu ? (
            <div>
              <Typography variant="body1">LippuId: {lippu.lippuId}</Typography>
              <Typography variant="body1">
                Tapahtuman nimi: {lippu.tapahtuma.nimi}
              </Typography>
              <Typography variant="body1">
                Hintaluokka: {lippu.hinnasto.hintaluokka}
              </Typography>
              <Typography variant="body1">Lippumäärä: {lippu.maara}</Typography>
              <Typography variant="body1">
                Käytetty: {lippu.kaytetty.toString()}
              </Typography>
              <Box mt={2}>
                <Button variant="contained" color="success" onClick={kaytaLippu}>
                  Merkitse käytetyksi
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={eikaytaLippu}
                  sx={{ marginLeft: 2 }}
                >
                  peruuta
                </Button>
              </Box>
            </div>
          ) : (
            <Typography variant="body2" color="textSecondary" mt={3}>
              Ei saatavilla tietoja maksua varten.
            </Typography>
          )}
  
          {error && (
            <Typography variant="body2" color="error" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </>
    );
}

export default Tarkistus


