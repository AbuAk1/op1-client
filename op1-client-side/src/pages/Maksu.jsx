import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lippu } from "../components/Lippu";

import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';

function Maksu() {
    const token = localStorage.getItem("token");
    const location = useLocation(); // Hook navigointidatan käyttöön
    const navigate = useNavigate(); // Hook navigointiin

    // Pääsy siirrettyyn dataan state-ominaisuudesta
    const { lisatytLiput } = location.state || {};
    const [maksutapahtuma, setMaksutapahtuma] = useState();
    const [paymentCreated, setPaymentCreated] = useState(false);


    const [liput, setLiput] = useState(lisatytLiput);

    let yhteishinta = 0;

    liput.forEach(lippu => {
        yhteishinta += lippu.hinta;
    });
    
    
    
    const [myydytLiput, setMyydytLiput] = useState([]);

    const laskuta = async () => {
        // Luodaan uusi maksutapahtuma
        const luoUusiMaksutapahtuma = async () => {
            try {
                const response = await fetch(
                    `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/maksutapahtumat`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "kayttaja": {
                                "kayttajaId": 1
                            }
                        })
                    }
                );
    
                if (response.ok) {
                    const data = await response.json();
                    setMaksutapahtuma(data["maksutapahtumaId"]);
                    setPaymentCreated(true);
                    return data["maksutapahtumaId"];  // Palautetaan ID, jotta tiedämme sen arvon
                } else {
                    const errorData = await response.json();
                    console.error("Virhe maksutapahtuman luonnissa:", errorData);
                    throw new Error("Maksutapahtumaa ei voitu luoda.");
                }
            } catch (error) {
                console.error("Virhe pyynnön aikana:", error);
                throw error; // Heitetään virhe edelleen eteenpäin
            }
        };
    
        // Luodaan maksutapahtuma ennen lipun käsittelyä ja odotetaan sen valmistumista
        let uusiMaksutapahtuma;
        try {
            uusiMaksutapahtuma = await luoUusiMaksutapahtuma();  // Odotetaan maksutapahtuman luontia
        } catch (error) {
            alert("Maksutapahtumaa ei luotu error!");
            return; // Lopetetaan laskutuksen suorittaminen, jos maksutapahtumaa ei voitu luoda
        }
    
        // Varmistetaan, että maksutapahtuma on luotu
        if (!uusiMaksutapahtuma) {
            alert("Maksutapahtumaa ei luotu!");
            return;
        }
    
        // Muokataan liput oikealla maksutapahtuman ID:llä
        
        const muokatutLiput = liput.map(lippu => ({
            tapahtuma: {
                tapahtumaId: parseInt(lippu["tapahtumaId"])
            },
            hinnasto: {
                hinnastoid: parseInt(lippu["hinnastoId"])
            },
            maksutapahtuma: {
                maksutapahtumaId: parseInt(uusiMaksutapahtuma) // Käytetään luotua maksutapahtuman ID:tä
            }
        }));
    
        // Lähetetään muokatut liput palvelimelle
        for (let i = 0; i < muokatutLiput.length; i++) {
            
            try {
                const response = await fetch(
                    `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/liput`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(muokatutLiput[i]),
                    }
                );
    
                if (response.ok) {
                    const data = await response.json();
                    setMyydytLiput(prevLiput => [...prevLiput, data]);
                } else {
                    alert(response.status);
                }
            } catch (error) {
                console.error("Virhe pyynnön aikana:", error);
            }
        }
    };
    

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Maksu
            </Typography>

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

            {liput && liput.length > 0 ? (
                <TableContainer sx={{ mb: 2 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Lippu</TableCell>
                                {liput[0] && Object.keys(liput[0]).map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {liput.map((lippu, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>{`Lippu ${index + 1}`}</TableCell>
                                    {Object.entries(lippu).map(([key, value]) => (
                                        <TableCell key={key}>{value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">Ei saatavilla tietoja maksua varten.</Typography>
            )}

            <Box>
                <Typography sx={{ marginBottom: '30px' }}>Hinta yhteensä: <b style={{ fontSize: '20px' }}>{yhteishinta}€</b></Typography>
            </Box>

            <Button disabled={paymentCreated} variant="contained" color="primary" onClick={laskuta} sx={{ marginBottom: 2 }}>
                Laskuta ja tulosta liput
            </Button>

            {myydytLiput.length > 0 ? (
                <Box>
                    <Typography variant="h6" component="p">
                        Lippuja myyty
                    </Typography>

                    {myydytLiput.map((lippu) => (
                        <Lippu key={lippu.lippuId} lippu={lippu} />
                    ))}
                </Box>
            ) : (
                <Typography variant="body1">Ei lippuja vielä myyty</Typography>
            )}
        </Box>
    );

}

export default Maksu;
