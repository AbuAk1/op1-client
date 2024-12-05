import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    Select,
    MenuItem,
    Modal,
    CssBaseline
} from '@mui/material';
import Raportti from '../components/Raportti';

function Raporttisivu() {
    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const [tapahtumat, setTapahtumat] = useState([]);
    const [valittuTapahtuma, setValittuTapahtuma] = useState(null);
    const [raporttiModal, setRaporttiModal] = useState(false);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    useEffect(() => {
        // Jos käyttäjä ei ole admin ohjataan takaisin home-sivulle
        if (role !== 'ADMIN') {
            navigate("/home");
        }
    }, []);

    useEffect(() => {
        // Haetaan tapahtumat, kun komponentti ladataan
        haeTapahtumat();
    }, []);

    const haeTapahtumat = async () => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTapahtumat(data);
            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    const avaaRaporttiModal = () => {
        if (valittuTapahtuma) {
            setRaporttiModal(true);
        } else {
            alert("Valitse ensin tapahtuma!");
        }
    };

    const suljeRaporttiModal = () => {
        setRaporttiModal(false);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <CssBaseline />
            <Typography variant="h4" gutterBottom>
                Raporttisivu
            </Typography>

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
            >
                Avaa Raportti
            </Button>

            {valittuTapahtuma && (
                <Modal
                    open={raporttiModal}
                    onClose={suljeRaporttiModal}
                >
                    <Raportti
                        open={raporttiModal}
                        onClose={suljeRaporttiModal}
                        tapahtuma={valittuTapahtuma}
                        role={role}
                        url={url}
                        token={token}
                    />
                </Modal>
            )}
        </Box>
    );
}

export default Raporttisivu;
