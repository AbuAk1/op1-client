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
    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState([]);
    const [tapahtuma, setTapahtuma] = useState('');
    const [muokattavaTapahtuma, setMuokattavaTapahtuma] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [tapahtumaModal, setTapahtumaModal] = useState(false);
    const [raporttiModal, setRaporttiModal] = useState(false);
    const [filteredTapahtumat, setFilteredTapahtumat] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [hinnastot, setHinnastot] = useState([]);
    const [hinnastoluokka, setHinnastoLuokka] = useState('');
    const [hinta, setHinta] = useState('');

    const [uusiTapahtuma, setUusiTapahtuma] = useState({
        id: "",
        nimi: "",
        aika: "",
        paikka: "",
        kuvaus: "",
        lippumaara: 0,
        ennakkomyynti: ""
    });

    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    useEffect(() => {
        // Jos käyttäjä ei ole admin ohjataan takaisin home-sivulle
        if (role !== 'ADMIN') {
            navigate("/home");
        }
    }, []);

    // haetaan kaikki tapahtumat
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
                setFilteredTapahtumat(data);
            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // poistetaan tapahtuma
    const poistaTapahtuma = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                // Poista tapahtuma filteredTapahtumat-taulukosta
                setFilteredTapahtumat(prevFiltered =>
                    prevFiltered.filter(tapahtuma => tapahtuma.tapahtumaId !== tapahtumaId)
                );
                alert('Tapahtuma poistettu');
            } else {
                alert('Et voi poistaa tapahtumaa jossa on lippuja tai hinnastoja');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // haetaan hinnastot tapahtumalle
    const haeHinnastot = async (tapahtumaId) => {

        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}/hinnastot`,
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
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // poistetaan hinnasto
    const poistaHinnasto = async (hinnastoId) => {

        try {
            const response = await fetch(
                `${url}/api/hinnastot/${hinnastoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                // Poista hinnasto taulukosta
                setHinnastot(prevHinnastot =>
                    prevHinnastot.filter(item => item.hinnastoid !== hinnastoId)
                );
                alert('Hinnastoluokka poistettu');

            } else {
                alert('Et voi poistaa käytössä olevaa hinnastoa')
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // luodaan hinnasto
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
                `${url}/api/hinnastot`,
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


    useEffect(() => {
        if (muokattavaTapahtuma) {
            setUusiTapahtuma(muokattavaTapahtuma);
        }
    }, [muokattavaTapahtuma]);



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
            setTapahtuma(tapahtumaId);
            // Haetaan hinnastot tapahtumalle
            await haeHinnastot(tapahtumaId);

            // Avaa modalin, kun hinnastot on haettu
            setModalOpen(true);
        } catch (error) {
            console.error('Virhe hinnastojen haussa', error);
        }
    };

    const avaaTapahtumaModal = () => {
        setTapahtumaModal(true);
    };
    

    const avaaRaporttiModal = (valittuTapahtuma) => {
        setTapahtuma(valittuTapahtuma); // Aseta valittu tapahtuma
        setRaporttiModal(true); // Aseta modal auki
    };

    const tyhjennaTapahtumaKentat = () => {
        setUusiTapahtuma({
            id: "",
            nimi: "",
            aika: "",
            paikka: "",
            kuvaus: "",
            lippumaara: 0,
            ennakkomyynti: ""
        });
        setMuokattavaTapahtuma(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUusiTapahtuma((prevState) => {
            const newState = { ...prevState, [name]: value };
            return newState;
        });
    };

    // uuden tapahtuman luonti
    const luoUusiTaphtuma = async (uusiTapahtuma) => {

        if (
            !uusiTapahtuma.nimi ||
            !uusiTapahtuma.paikka ||
            !uusiTapahtuma.kuvaus ||
            !uusiTapahtuma.aika ||
            !uusiTapahtuma.ennakkomyynti ||
            uusiTapahtuma.lippumaara === 0
        ) {
            alert('Täytä kaikki kentät!');
            return;
        }



        try {
            const response = await fetch(
                `${url}/api/tapahtumat`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(uusiTapahtuma),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setFilteredTapahtumat((prevTapahtumat) => {
                    return [...prevTapahtumat, data];
                });

                alert('Tapahtuma lisätty');
                setTapahtumaModal(false);
                tyhjennaTapahtumaKentat();

                //kun lisätty tapahtuma, lisätään ovimyynti hinta 0e

                const hinnastoData = {
                    tapahtuma: {
                        tapahtumaId: data.tapahtumaId
                    },
                    hintaluokka: 'ovimyynti',
                    hinta: 0,
                };

                try {
                    const response = await fetch(
                        `${url}/api/hinnastot`,
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
                            return [...prevHinnastot, data];
                        });

                        alert('Ovimyynti hinta lisätty');
                    } else {
                        const errorData = await response.json();
                        alert('Virhe hinnaston luomisessa', errorData);
                    }
                } catch (error) {
                    alert('Virhe yhteydessä palvelimeen');
                }
            } else {
                const errorData = await response.json();
                alert(`Virhe tapahtuman lisäämisessä: ${errorData || 'Tuntematon virhe'}`);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    const muokkaaTapahtumaa = async (uusiTapahtuma) => {

        if (
            !uusiTapahtuma.nimi ||
            !uusiTapahtuma.paikka ||
            !uusiTapahtuma.kuvaus ||
            !uusiTapahtuma.aika ||
            !uusiTapahtuma.ennakkomyynti ||
            uusiTapahtuma.lippumaara === 0
        ) {
            alert('Täytä kaikki kentät!');
            return;

        } else if (!uusiTapahtuma.id) {
            alert('jotain meni vikaan id:tä ei löytynyt');
            return;

        } else {
            // tarkistetaan että tapahtuman aika eikä ennakkomyynti voi olla menneisyydessä
            const tapahtumaAika = new Date(uusiTapahtuma.aika);
            const ennakkomyynti = new Date(uusiTapahtuma.ennakkomyynti);

            if (tapahtumaAika < new Date()) {
                alert('Tapahtuman aika ei voi olla menneisyydessä');
                return;
            }

            if (ennakkomyynti < new Date()) {
                alert('Tapahtuman ennakkomyynti ei voi olla menneisyydessä');
                return;
            }
        }

        const { id, ...bodyarray } = uusiTapahtuma;

        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${uusiTapahtuma.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyarray),
                }
            );
            if (response.ok) {
                const data = await response.json();

                setFilteredTapahtumat((prevTapahtumat) => {
                    return prevTapahtumat.map((tapahtuma) => {
                        if (tapahtuma.tapahtumaId === data.tapahtumaId) {
                            return { ...tapahtuma, ...data };
                        }
                        return tapahtuma;
                    });
                });

                alert('Tapahtuma muokattu');
                setTapahtumaModal(false);
                tyhjennaTapahtumaKentat();
            } else {
                const errorData = await response.json();
                alert(`Virhe tapahtuman muokkaamisessa: ${errorData.message || 'Tuntematon virhe'}`);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    return (
        <>
            <CssBaseline />
            <Box display="flex" sx={{ height: '100vh', width: '100%', gap: 2 }}>
                {/* Sidebar */}
                <Box sx={{
                    width: { xs: '100%', md: '20%' },
                    backgroundColor: '#f9f9f9',
                    padding: 2,
                    borderRadius: 6,
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                }}>
                    <Button variant="outlined" color="primary" onClick={() => navigate(-1)} sx={{ mb: 5, mt: 2 }} size='small'>
                        Takaisin Valikkoon
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                        onClick={avaaTapahtumaModal}>
                        Lisää Tapahtuma +
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                        onClick={() => navigate("/Raporttisivu")}>
                        Raportit
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                        onClick={() => alert('Käyttäjien hallinta tulossa myöhemmin')}>
                        Hallinnoi käyttäjiä
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
                        display: 'flex',
                        backgroundColor: '#f9f9f9',
                        padding: '40px 30px',
                        borderRadius: 5,
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                        <TextField
                            label="Hae tapahtumaa nimellä"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="contained"
                            onClick={clearSearch}
                            sx={{ height: '100%', whiteSpace: 'nowrap', }}
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
                                            <TableCell><b>Toiminnot</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTapahtumat.map((tapahtuma) => (
                                            <TableRow key={tapahtuma.id}>
                                                <TableCell>{tapahtuma.nimi}</TableCell>
                                                <TableCell sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => {
                                                        setMuokattavaTapahtuma({
                                                            id: tapahtuma.tapahtumaId,
                                                            nimi: tapahtuma.nimi,
                                                            aika: tapahtuma.aika,
                                                            paikka: tapahtuma.paikka,
                                                            kuvaus: tapahtuma.kuvaus,
                                                            lippumaara: tapahtuma.lippumaara,
                                                            ennakkomyynti: tapahtuma.ennakkomyynti,
                                                        });
                                                        setTapahtumaModal(true);
                                                        }}
                                                        size="small"
                                                        disabled={new Date(tapahtuma.aika) < new Date()} // Estetään klikkaus menneisyydessä oleville tapahtumille
                                                        >
                                                        Muokkaa
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => alert(`
                                                            Tapahtuma: ${tapahtuma.nimi}
                                                            Aika: ${tapahtuma.aika}
                                                            Lippumäärä: ${tapahtuma.lippumaara}
                                                            Paikka: ${tapahtuma.paikka}
                                                            Ennakkomyynti loppuu: 
                                                            ${tapahtuma.ennakkomyynti}
                                                            `)}
                                                        size="small"
                                                    >
                                                        Lisätiedot
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => avaaHinnastoModal(tapahtuma.tapahtumaId)}
                                                        size="small"
                                                    >
                                                        Hinnastot
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
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

            {/*Tapahtuma modal*/}
            <Modal
                open={tapahtumaModal}
                onClose={() => {
                    tyhjennaTapahtumaKentat();  // Tyhjentää kentät
                    setTapahtumaModal(false);       // Sulkee modaalin
                }}
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
                    borderRadius: 5,
                    boxShadow: 24,
                    padding: '40px 100px',
                    gap: 3,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    <Typography variant='h6' sx={{ mb: 2 }}>Uusi tapahtuma</Typography>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: '0 auto' }}
                    >
                        <TextField
                            label="Nimi"
                            name="nimi"
                            value={uusiTapahtuma.nimi}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Aika"
                            name="aika"
                            type="date"
                            value={uusiTapahtuma.aika}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Paikka"
                            name="paikka"
                            value={uusiTapahtuma.paikka}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Kuvaus"
                            name="kuvaus"
                            value={uusiTapahtuma.kuvaus}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Lippumäärä"
                            name="lippumaara"
                            type="number"
                            value={uusiTapahtuma.lippumaara}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Ennakkomyynti päättyy"
                            name="ennakkomyynti"
                            type="date"
                            value={uusiTapahtuma.ennakkomyynti}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            required
                        />
                        <Button
                            onClick={() =>
                                muokattavaTapahtuma
                                    ? muokkaaTapahtumaa(uusiTapahtuma)
                                    : luoUusiTaphtuma(uusiTapahtuma)
                            }
                            variant="contained"
                            color="primary"
                        >
                            {muokattavaTapahtuma ? 'Päivitä tapahtuma' : 'Tallenna tapahtuma'}
                        </Button>

                    </Box>
                </Box>
            </Modal>

            {/* Hinnasto modal */}
            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setHinnastot([]);
                }}
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
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
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
