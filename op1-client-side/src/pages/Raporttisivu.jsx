import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    Select,
    MenuItem,
    CssBaseline
} from '@mui/material';
import Raportti from '../components/raportti/Raportti';
import useRaportti from '../hooks/useRaportti';

function Raporttisivu() {

    // Haetaan käyttäjän rooli
    const role = localStorage.getItem('role');

    // Käytetään useRaportti-hookkia
    const { valittuTapahtuma, tapahtumat, avaaRaporttiModal, suljeRaporttiModal,
        raporttiModal, loading, data, message, setValittuTapahtuma } = useRaportti();

    // Käytetään navigointia
    const navigate = useNavigate();

    // Ohjataan käyttäjä takaisin etusivulle, mikäli ei ole admin-oikeuksia
    useEffect(() => {
        if (role !== 'ADMIN') {
            navigate("/home");
        }
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <CssBaseline />
            <Typography variant="h4" gutterBottom>
                Raporttisivu
            </Typography>


            {/* Valitaan tapahtuma, josta halutaan raportti */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6">Valitse tapahtuma:</Typography>
                <Select
                    value={valittuTapahtuma ? valittuTapahtuma.tapahtumaId : ''}
                    onChange={(e) => {
                        const tapahtuma = tapahtumat.find(t => t.tapahtumaId === e.target.value);
                        setValittuTapahtuma(tapahtuma);
                    }}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        Valitse tapahtuma
                    </MenuItem>
                    {tapahtumat.map((tapahtuma) => (
                        <MenuItem key={tapahtuma.tapahtumaId} value={tapahtuma.tapahtumaId}>
                            {tapahtuma.nimi}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={avaaRaporttiModal}
                sx={{ mr: 1 }}
            >
                Avaa Raportti
            </Button>

            <Button
                variant="outlined"
                onClick={() => navigate(-1)}
            >
                Takaisin
            </Button>

            {/* Jos tapahtuma on valittu näytetään raportti */}
            {valittuTapahtuma && (
                <Raportti
                    open={raporttiModal}
                    onClose={suljeRaporttiModal}
                    data={data}
                    loading={loading}
                    message={message}
                />
            )}
        </Box>
    );
}

export default Raporttisivu;
