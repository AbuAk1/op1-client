import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useTarkistus } from '../hooks/useTarkistus';
import LipunNaytto from '../components/tarkistus/LipunNaytto';

function Tarkistus() {

    // Käytetään usetarkistus-hookkia
    const { lippunumero, setLippunumero, lueQRTiedosto, lippu, kaytaLippu, peruutaKaytto, error } = useTarkistus();

    // Käytetään navigointia
    const navigate = useNavigate();

    return (
        <>
            {/* Navigointi takaisin valikkoon tarkistuksesta */}
            <Button
                variant="contained" onClick={() => navigate(-1)}
                sx={{ position: 'fixed', top: 16, left: 16, marginBottom: 2, zIndex: 100, borderRadius: '6px', }}>
                Takaisin
            </Button>

            <Box sx={{ marginBottom: 2, maxWidth: '500px', m: 'auto' }}>

                {/* Lippunumeron syöttäminen käsin */}
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Syötä lippunumero:
                </Typography>

                <TextField
                    fullWidth variant="outlined" label="Lippunumero" value={lippunumero}
                    onChange={(e) => setLippunumero(e.target.value)}
                />

                {/* QR-tiedoston lisäys ja lukeminen */}
                <Box sx={{ display: "flex-end" }}>
                    <Typography variant="body1" sx={{ mb: 1.5, marginTop: 3 }}>
                        Tai valitse tiedosto lukeaksesi QR-koodi:
                    </Typography>
                    <Button variant="outlined" color='inherit' size='small' component="label" >
                        Valitse tiedosto
                        <input type="file" accept="image/*" hidden onChange={lueQRTiedosto} />
                    </Button>
                </Box>

                {/* Näytetään lippunumerolla löytynyt lippu */}
                <LipunNaytto
                    lippu={lippu}
                    kaytaLippu={kaytaLippu}
                    peruutaKaytto={peruutaKaytto}
                />

                {/* Näytetään virheilmoitus, mikäli toiminnoissa ilmenee virheitä */}
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