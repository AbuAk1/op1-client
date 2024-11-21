import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Box,
    Card,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer,
    Paper,
    CssBaseline
} from '@mui/material';

function Hallinta() {
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState([]);
    const [tapahtuma, setTapahtuma] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredTapahtumat, setFilteredTapahtumat] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [hinnastot, setHinnastot] = useState([]);
    const [hinnastoluokka, setHinnastoLuokka] = useState('');
    const [hinta, setHinta] = useState('');

    const navigate = useNavigate();

    const haeTapahtumat = async () => {
        try {
            const response = await fetch(
                'https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat',
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
                setFilteredTapahtumat(data);
            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    const poistaTapahtuma = async (tapahtumaId) => {
        console.log(tapahtumaId);
        try {
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat/${tapahtumaId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                // Log the status code and response text if not successful
                console.error(`Virhe tapahtumien haussa. Statuskoodi: ${response.status}`);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };
    

    const haeHinnastot = async (tapahtumaId) => {
        
        try {
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat/${tapahtumaId}/hinnastot`,
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
                setHinnastot(data);
            } else {
                console.error('Virhe hinnastojen haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    const poistaHinnasto = async (hinnastoId) => {  
        console.log(hinnastoId);
        
        try {
            // Haetaan hinnaston id suoraan, ei käytetä indeksiä
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/hinnastot/${hinnastoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.ok) {
                alert('hinnastoluokka poistettu');
            } else if (response.status === 404) {
                // Jos hinnastoa ei löydy
                alert('Hinnasto ei löytynyt tai on linkitetty lippuun.');
            } else if (response.status === 403) {
                // Jos käyttäjällä ei ole oikeuksia
                alert('Ei riittäviä oikeuksia hinnaston poistamiseen.');
            } else {
                console.error('Virhe hinnaston poistossa');
                alert('Virhe hinnaston poistossa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
            alert('Virhe pyynnön aikana');
        }
    };

    const luoHinnasto = async () => {
        if (!hinnastoluokka || !hinta) {
            alert('Täytä kaikki kentät!');
            return;
        }

        const hinnastoData = {
            tapahtuma: {
                tapahtumaId: tapahtuma
            },
            hintaluokka: hinnastoluokka,
            hinta: parseFloat(hinta), 
        };

        try {
            const response = await fetch(
                'https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/hinnastot',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(hinnastoData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Päivitetään hinnastot-tila
                setHinnastot((prevHinnastot) => {
                    return [...prevHinnastot, data];  // Lisää uusi hinnasto edellisten perään
                });

                alert('Hinnasto päivitetty onnistuneesti');
            } else {
                const errorData = await response.json();
                console.error('Virhe hinnaston luomisessa:', errorData);
                alert('Virhe hinnaston luomisessa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
            alert('Virhe yhteydessä palvelimeen');
        }
    };

    useEffect(() => {
        // Suoritetaan haeTapahtumat, kun komponentti ladataan
        haeTapahtumat();
    }, []);

    //console.log(tapahtumat);
    
    

    // Suodattaa tapahtumat käyttäjän syötteen mukaan
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filtered = tapahtumat.filter(tapahtuma =>
            tapahtuma.nimi.toLowerCase().includes(value.toLowerCase()) // Suodatus tapahtuman nimen perusteella
        );
        setFilteredTapahtumat(filtered);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredTapahtumat(tapahtumat);
    };

    const avaaHinnastoModal = async (tapahtumaId) => {
        try {
            // Haetaan hinnastot tapahtumalle
            await haeHinnastot(tapahtumaId);
            
            
            // Avaa modalin, kun hinnastot on haettu
            setModalOpen(true);
            setTapahtuma(tapahtumaId);
        } catch (error) {
            console.error('Virhe hinnastojen haussa', error);
        }
    };

    useEffect(() => {
        if (hinnastot.length > 0) {
            console.log(hinnastot);
        }
    }, [hinnastot]);
    
    
    

    return (
        <>
            <CssBaseline />
            <Box display="flex" sx={{ height: '120vh', width: '100%', gap: 2 }}>
                {/* Sidebar */}
                <Box sx={{
                    width: { xs: '100%', md: '20%' },
                    backgroundColor: '#f9f9f9',
                    padding: 2,
                    borderRadius: 6,
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                }}>
                    <Button variant="outlined" color="primary" onClick={() => navigate(-1)} sx={{ mb: 10 }} size='small'>
                        Takaisin keskukseen
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'>
                        Lisää Tapahtuma
                    </Button>
                </Box>

                {/* Main Content */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: 2,
                }}>
                    {/* Etsi */}
                    <Box sx={{
                        backgroundColor: '#f9f9f9',
                        padding: 5,
                        borderRadius: 6,
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                    }}>
                        <TextField
                            label="Hae tapahtumaa nimellä"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2, mb: 2 }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="contained"
                            onClick={clearSearch}
                        >
                            Poista haku
                        </Button>
                    </Box>

                    {/* Tapahtumat */}
                    <Box sx={{
                        backgroundColor: '#f9f9f9',
                        flex: 1,
                        padding: 5,
                        minHeight: 200,
                        borderRadius: 6,
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                        overflow: 'auto'
                    }}>
                        <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>Tapahtumat</Typography>
                        {filteredTapahtumat.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Nimi</b></TableCell>
                                            <TableCell><b>Kuvaus</b></TableCell>
                                            <TableCell><b>Toiminnot</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTapahtumat.map((tapahtuma) => (
                                            <TableRow key={tapahtuma.id}>
                                                <TableCell>{tapahtuma.nimi}</TableCell>
                                                <TableCell>{tapahtuma.kuvaus}</TableCell>
                                                <TableCell sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => alert(`
                                                            Tapahtuma: ${tapahtuma.nimi}
                                                            Lippumäärä: ${tapahtuma.lippumaara}
                                                            Paikka: ${tapahtuma.paikka}
                                                            Ennakkomyynti loppuu: ${tapahtuma.ennakkomyynti}
                                                            `)}
                                                        size="small"
                                                    >
                                                        Lisätiedot
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => avaaHinnastoModal(tapahtuma.tapahtumaId)}
                                                        size="small"
                                                    >
                                                        Hinnastot
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => poistaTapahtuma(tapahtuma.tapahtumaId)}
                                                        size="small"
                                                    >
                                                        Poista 
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>Ei tapahtumia saatavilla.</Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Hinnastomodal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '300px',
                    height: '80%',
                    margin: 'auto',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 5,
                    gap: 3,
                    overflow: 'auto',
                }}>
                    {/* Nykyiset hinnastotiedot */}
                    <Box sx={{ overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Nykyiset hinnastotiedot: {hinnastot?.[0]?.tapahtuma?.nimi}
                        </Typography>
                        <TableContainer sx={{ pd: 1 }}>
                            <Table aria-label="Hinnastot-taulukko">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Hintaluokka</strong></TableCell>
                                        <TableCell><strong>Hinta (€)</strong></TableCell>
                                        <TableCell><strong>Toiminnot</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hinnastot.length > 0 ? (
                                        hinnastot.map((hinnasto, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{hinnasto.hintaluokka}</TableCell>
                                                <TableCell>{hinnasto.hinta}€</TableCell>
                                                <TableCell>
                                                    <Button 
                                                        variant="outlined" 
                                                        color="error"
                                                        onClick={() => poistaHinnasto(hinnasto.hinnastoid)}
                                                    >
                                                        Poista
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <Typography variant="body1">Ei hinnastotietoja.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Lomake */}
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Lisää uusi hinnastoluokka</Typography>
                        <TextField
                            label="Hinnastoluokka"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={hinnastoluokka}
                            onChange={(e) => setHinnastoLuokka(e.target.value)}
                        />
                        <TextField
                            label="Hinta (€)"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            type="number"
                            value={hinta}
                            onChange={(e) => setHinta(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={luoHinnasto}      
                        >
                            Tallenna
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default Hallinta;
