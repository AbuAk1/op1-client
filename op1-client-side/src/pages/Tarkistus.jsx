import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import jsQR from "jsqr";

function Tarkistus() {
    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const [lippunumero, setLippunumero] = useState("");
    const [lippuId, setLippuId] = useState("");
    const [lippu, setLippu] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    
    useEffect(() => {
        if (lippunumero) {
            etsi();
        }
    }, [lippunumero]);

    const etsi = async () => {
        if (!lippunumero) {
            return;
        }
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${url}/api/liput/koodi/${lippunumero}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLippu(data);
                setLippuId(data.lippuId);
                setError('');
            } else {
                if (response.status == 410) {
                    console.error("Lippu on palautettu tai poistettu");
                    setLippu(null);
                    setError('Lippu on palautettu tai poistettu. Lippua ei voi merkitä käytetyksi.');
                } else {
                    console.error("Lipun haku epäonnistui");
                    setLippu(null);
                    setError('Lippua ei löytynyt, tarkista lippunumero.');
                }
            }
        } catch (error) {
            console.error("Virhe haussa: ", error);
            setLippu(null);
            setError('Virhe lipun haussa')
        }
    };

    const lueQRTiedosto = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Valitse tiedosto!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    // QR-koodista luettu data
                    setLippunumero(code.data);
                    etsi();
                } else {
                    alert("QR-koodia ei löytynyt. Varmista, että kuva sisältää selkeän QR-koodin.");
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };


    const kaytaLippu = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${url}/api/liput/${lippuId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "kaytetty": true, }),
            });

            if (response.ok) {
                const data = await response.json();
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



    const peruutaKaytto = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${url}/api/liput/${lippuId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "kaytetty": false, }),
            });

            if (response.ok) {
                const data = await response.json();
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
                variant="contained" onClick={() => navigate(-1)}
                sx={{ position: 'fixed', top: 16, left: 16, marginBottom: 2, zIndex: 100, borderRadius: '6px', }}>
                Takaisin
            </Button>
            <Box
                sx={{ marginBottom: 2, maxWidth: '500px', m: 'auto' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Syötä lippunumero:
                </Typography>

                {/* Tekstisyöte 4a26d2aa-bc1f-45ce-8cb0-adb7841f0a9f */}
                <TextField
                    fullWidth variant="outlined" label="Lippunumero" value={lippunumero}
                    onChange={(e) => setLippunumero(e.target.value)}
                />

                {/* Tiedoston lisäys */}
                <Box sx={{ display: "flex-end" }}>
                    <Typography variant="body1" sx={{ mb: 1.5, marginTop: 3 }}>
                        Tai valitse tiedosto lukeaksesi QR-koodi:
                    </Typography>
                    <Button variant="outlined" color='inherit' size='small' component="label" >
                        Valitse tiedosto
                        <input type="file" accept="image/*" hidden onChange={lueQRTiedosto} />
                    </Button>
                </Box>
                <Box mt={2}>
                    {lippu ? (
                        <div>
                            <Typography variant='h5' sx={{ marginTop: 7, marginBottom: 1 }}>Lipun tiedot:</Typography>
                            <Typography variant="body1">LippuId: {lippu.lippuId}</Typography>
                            <Typography variant="body1">Tapahtuman nimi: {lippu.tapahtuma.nimi}</Typography>
                            <Typography variant="body1">Tapahtuman ajankohta: {lippu.tapahtuma.aika}</Typography>
                            <Typography variant="body1">Hintaluokka: {lippu.hinnasto.hintaluokka}</Typography>
                            <Typography variant="body1">Käytetty: {lippu.kaytetty.toString()}</Typography>

                            {lippu.kaytetty && (
                                <Typography variant="body1" color="error" sx={{ fontWeight: 'bold', marginBottom: 5 }} mt={3}>
                                    Tämä lippu on jo käytetty.
                                </Typography>
                            )}

                            {lippu.removed ? (
                                <Typography variant="body2" color="error" mt={3}>
                                    Tämä lippu on poistettu tai palautettu, eikä sitä voi käyttää.
                                </Typography>
                            ) : (
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={kaytaLippu}
                                        disabled={lippu.kaytetty} // Jos lippu on jo käytetty
                                    >
                                        Merkitse käytetyksi
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={peruutaKaytto}
                                        sx={{ marginLeft: 2 }}
                                    >
                                        Palauta käyttämättömäksi
                                    </Button>
                                </Box>
                            )}
                        </div>
                    ) : (
                        <Typography variant="body2" color="textSecondary" mt={3}>
                            Ei haettuja tietoja.
                        </Typography>
                    )}
                </Box>
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