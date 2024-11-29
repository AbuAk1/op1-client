import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardActions,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    Accordion,
    AccordionSummary,
    AccordionDetails
    
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Myynti() {
    const token = localStorage.getItem('token');
    const [tapahtumat, setTapahtumat] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTapahtuma, setSelectedTapahtuma] = useState(null);
    const [hinnastot, setHinnastot] = useState([]);
    const [selectedHintaluokka, setSelectedHintaluokka] = useState('');
    const [lisatytLiput, setLisatytLiput] = useState([]);
    const [maksutapahtumat, setMaksutapahtumat] = useState([]);
    const [liput, setLiput] = useState([]);
    const [maksutapahtumanLiput, setMaksutapahtumanLiput] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const lisaaMyydytLiput = async () => {
            // Luodaan kopio tapahtumista
            const tapahtumatKopio = [...tapahtumat];
    
            // Käydään läpi jokainen tapahtuma ja haetaan myydyt liput
            const tapahtumatMyydyillaLipuilla = await Promise.all(
                tapahtumatKopio.map(async (tapahtuma) => {
                    // Tarkista, onko 'myydytLiput' jo olemassa
                    if (tapahtuma.myydytLiput == null) {
                        const myydytliput = await haeTapahtumanLiput(tapahtuma.tapahtumaId); // Hae liput
                        return { ...tapahtuma, myydytLiput: myydytliput }; // Päivitä myydyt liput
                    }
                    return tapahtuma;
                })
            );
    
            // Päivitetään tapahtumat tilaan, jos ne ovat muuttuneet
            if (JSON.stringify(tapahtumat) !== JSON.stringify(tapahtumatMyydyillaLipuilla)) {
                setTapahtumat(tapahtumatMyydyillaLipuilla); // Päivitä tapahtumat tilaan
            }
        };
    
        lisaaMyydytLiput();
    }, [tapahtumat]); // Ajetaan aina, kun 'tapahtumat' muuttuu
    
    useEffect(() => {
        console.log(tapahtumat);
        
    }, [tapahtumat])

    const haeTapahtumat = async () => {

        setMaksutapahtumat([])

        try {
            const response = await fetch(
                'https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat',
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

    const haeHinnastot = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat/${tapahtumaId}/hinnastot`,
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

    const haeYksiHinnasto = async (hinnastoId) => {
        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/hinnastot/${hinnastoId}`,
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
                return data;
                
            } else {
                console.error('Virhe hinnastojen haussa');
                return null;
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
            return null;
        }
    };

    const haeTapahtumanLiput = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat/${tapahtumaId}/liput`,
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
                if (data.length > 0) {
                    return data.length;
                } else {
                    alert('ei lippuja');
                }
    
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    };      
    
    useEffect(() => {
        haeTapahtumanLiput(1);
    })

    const avaaModal = (tapahtuma) => {
        setSelectedTapahtuma(tapahtuma);
        setSelectedHintaluokka('');
        haeHinnastot(tapahtuma.tapahtumaId);
        setModalOpen(true);
    };

    const suljeModal = () => {
        setModalOpen(false);
        setSelectedTapahtuma(null);
        setHinnastot([]);
    };

    const lisaaLippu = async () => {

    
       if(selectedTapahtuma.lippumaara - lisatytLiput.length == 0) {
            return;
        }

        if (!selectedHintaluokka) {
            alert('Valitse hintaluokka ennen lisäämistä!');
            return;
        }
    
        // Odota hinnan saamista asynkronisesti
        const hintaTiedot = await haeYksiHinnasto(selectedHintaluokka);
    
        if (hintaTiedot === null) {
            alert('Hinnan hakeminen epäonnistui!');
            return;
        }
    
        // Luo uusi lippu objektin, kun hinta on saatu
        const uusiLippu = {
            tapahtumaId: selectedTapahtuma.tapahtumaId,
            tapahtuma: selectedTapahtuma.nimi,
            hinnastoId: selectedHintaluokka,
            hinta: hintaTiedot.hinta,
            hintaluokka: hintaTiedot.hintaluokka,
        };
    
        setLisatytLiput((prev) => [...prev, uusiLippu]);
        suljeModal();
    };
    

    const poistaLippu = (index) => {
        setLisatytLiput((prevLiput) => prevLiput.filter((_, i) => i !== index));
    };

    const siirryMaksuun = () => {
        navigate('/maksu', { state: { lisatytLiput } });
    };

    const haeMaksutapahtumat = async () => {

        setTapahtumat([])

        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/maksutapahtumat`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Maksutapahtumat haettu", data);
                const suodatetutTapahtumat = data.filter((tapahtuma) => !tapahtuma.removed);
                setMaksutapahtumat(suodatetutTapahtumat);
                await haeLiput();
            } else {
                const errorData = await response.json();
                console.error("Virhe maksutapahtumien haussa", errorData)
                throw new Error("Maksutapahtumia ei voida noutaa.");
            }
        } catch (error) {
            console.error("Virhe maksutapahtumapyynnön aikana:", error);
            throw error;
        }
    }

    const haeLiput = async () => {
        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/liput`,
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
                setLiput(data)
                console.log("Liput haettu", data)
            } else {
                const errorData = await response.json();
                console.error("Virhe lippujen haussa", errorData);
                throw new Error("Lippuja ei voida noutaa.");
            }
        } catch (error) {
            console.error("Virhe lippupyynnön aikana: ", error)
            throw error;
        }
    };

    const haeMaksutapahtumanLiput = async (id) => {

        if (maksutapahtumanLiput[id]) {
            return;
        }

        const suodatetutLiput = liput.filter((lippu) => 
            lippu.maksutapahtuma && lippu.maksutapahtuma.maksutapahtumaId === id
        );

        setMaksutapahtumanLiput((prevState) => ({
            ...prevState,
            [id]: suodatetutLiput,
        }));
    }

    const poistaMaksutapahtuma = async (id) => {

        const confirmDelete = window.confirm("Haluatko varmasti poistaa maksutapahtuman lippuineen?");

        if (!confirmDelete) {
            console.log("Tapahtuman poisto peruttiin.");
            return; 
        }

        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/maksutapahtumat/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
            });

            if (response.ok) {
                console.log("Maksutapahtuma poistettu id:llä", id);
                await poistaMaksutapahtumanLiput(id);
                await haeMaksutapahtumat();
                setMaksutapahtumanLiput({});
            } else {
                const errorData = await response.json();
                console.error("Virhe maksutapahtuman poistossa", errorData)
                throw new Error("Maksutapahtumaa ei voida poistaa.");
            }
        } catch (error) {
            console.error("Virhe maksutapahtuman poistopyynnön aikana:", error);
            throw error;
        }

    }

    const poistaMaksutapahtumanLiput = async (id) => {

        await haeMaksutapahtumanLiput(id);

        if (!maksutapahtumanLiput[id] || maksutapahtumanLiput[id].length === 0) {
            console.log("Ei lippuja poistettavaksi.");
            return;
        }

        for (const lippu of maksutapahtumanLiput[id]) {

        try {
            const response = await fetch(
                `https://ticketguru-backend-current-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/softdelete/${lippu.lippuId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
            });

            if (response.ok) {
                console.log("Lippu poistettu id:llä", lippu.lippuId);
            } else {
                const errorData = await response.json();
                console.error("Virhe lipun poistossa", errorData)
                throw new Error("Lippua ei voida poistaa.");
            }
        } catch (error) {
            console.error("Virhe lipun poistopyynnön aikana:", error);
            throw error;
        }
        }

    }

    const tulostaLiput = async (id) => {

    }

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                Takaisin
            </Button>
            <Button variant="contained" color="primary" onClick={haeTapahtumat} sx={{ mr: 1 }}>
                Hae tapahtumat
            </Button>
            <Button variant="contained" color="primary" onClick={haeMaksutapahtumat}>
                Hae maksutapahtumat
            </Button>
    
            {tapahtumat && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4, mb: '200px', pb: '200px' }}>
                    {tapahtumat.map((tap) => (
                        <Card key={tap.tapahtumaId} sx={{ width: 320, mb: 2, padding: '30px', borderRadius: '20px'}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {tap.nimi}
                                </Typography>
                                <Typography>
                                    <strong>Ajankohta:</strong> {tap.aika}
                                </Typography>
                                <Typography>
                                    <strong>Paikka:</strong> {tap.paikka}
                                </Typography>
                                <Typography>
                                    <strong>Kuvaus:</strong> {tap.kuvaus}
                                </Typography>
                                <Typography>
                                    <strong>Ennakkomyynti päättyy:</strong> {tap.ennakkomyynti}
                                </Typography>
                                <Typography>
                                    <strong>Lippumäärä</strong> {tap.lippumaara}
                                </Typography>
                                <Typography>
                                    <strong>Lippuja jäljellä</strong> {tap.lippumaara-tap.myydytLiput}
                                </Typography>
                            </CardContent>
                            <CardActions>

                                <Button
                                    disabled={tap.lippumaara-tap.myydytLiput <= 0}
                                    variant="outlined"
                                    onClick={() => avaaModal(tap)}
                                >
                                    Myy lippuja
                                </Button>
                                <Button
                                    disabled={new Date(tap.ennakkomyynti) > new Date()}
                                    variant="outlined"
                                    onClick={() => tulostaLiput(tap)}
                                    style={{ display: new Date(tap.ennakkomyynti) <= new Date() ? 'inline-block' : 'none' }}
                                >
                                    Printtaa loput liput
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            {maksutapahtumat && (
                <Box sx={{marginTop: -25, display: 'flex', flexWrap: 'wrap',}}> 
                    {maksutapahtumat.map((maksu) => (
                        <Card key={maksu.maksutapahtumaId} sx={{margin: 3, borderRadius: 5, padding: 3, width: 500}}>
                                <Typography variant="h6">
                                    Maksutapahtuma {maksu.maksutapahtumaId}
                                </Typography>
                                <Typography>
                                  <strong>  Aikaleima: </strong>{maksu.aikaleima}
                                </Typography>
                                <Typography>
                                  <strong>Hinta: </strong> {maksu.hintayhteensa} €
                                </Typography>
                                <Typography>
                                   <strong>Myyjä: </strong> {maksu.kayttaja.kayttajaId}
                                </Typography>

                                <Accordion sx={{margin: 2}}
                                onChange={() => haeMaksutapahtumanLiput(maksu.maksutapahtumaId)}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    >
                                        <strong>Maksutapahtuman liput</strong>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {maksutapahtumanLiput[maksu.maksutapahtumaId] ? (
                                        maksutapahtumanLiput[maksu.maksutapahtumaId].length > 0 ? (
                                        maksutapahtumanLiput[maksu.maksutapahtumaId].map((lippu) => (
                                        <Typography key={lippu.lippuId}><strong>Lippu: </strong> {lippu.lippuId}, <strong>Hinta: </strong> {lippu.hinnasto.hinta} € {lippu.hinnasto.hintaluokka}, <strong>Tapahtuma: </strong>
                                        {lippu.tapahtuma.nimi}</Typography>
                                            ))
                                        ) : (
                                        <Typography>Ei lippuja saatavilla</Typography>
                                            )
                                        ) : (
                                        <Typography>Loading...</Typography> 
                                        )}
                                    </AccordionDetails>

                                </Accordion>
                                

                                <CardActions sx={{justifyContent: 'center'}}>
                                    <Button
                                    variant='contained'
                                    sx={{backgroundColor: 'red', ":hover": {backgroundColor: 'darkred'}}}
                                    onClick={() => poistaMaksutapahtuma(maksu.maksutapahtumaId)}>
                                        Poista maksutapahtuma
                                    </Button>
                                </CardActions>
                        </Card>
                    ))}

                </Box>
            )}
    
            {/* Modal */}
            <Modal open={modalOpen} onClose={suljeModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {selectedTapahtuma?.nimi}
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Hintaluokka</InputLabel>
                        <Select
                            value={selectedHintaluokka}
                            onChange={(e) => setSelectedHintaluokka(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                Valitse hintaluokka
                            </MenuItem>
                            {hinnastot.map((h) => (
                                <MenuItem key={h.hinnastoid} value={h.hinnastoid}>
                                    {h.hintaluokka} - {h.hinta} €
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedTapahtuma && selectedTapahtuma.lippumaara - lisatytLiput.length == 0 && (
                     <Typography variant="h6" gutterBottom color="error">Liput ovat loppuunmyyty</Typography>      )}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={lisaaLippu}
                        fullWidth
                    >
                        Lisää lippu
                    </Button>
                </Box>
            </Modal>
    
            {/* Ostoskori */}
            {lisatytLiput.length > 0 && (
            <Box
                sx={{
                    mt: 4,
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    p: 2,
                    maxHeight: '200px',
                    overflow: 'auto',
                    zIndex: 20, // Varmistaa, että ostoskori näkyy muiden elementtien päällä
                }}
            >
                <Typography variant="h6">Ostoskori</Typography>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ padding: '4px 8px' }}>TapahtumaID</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>Tapahtuma</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>HinnastoID</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>Hinta</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>Hintaluokka</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lisatytLiput.map((lippu, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ padding: '4px 8px' }}>{lippu.tapahtumaId}</TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>{lippu.tapahtuma}</TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>{lippu.hinnastoId}</TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>{lippu.hinta}</TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>{lippu.hintaluokka}</TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => poistaLippu(index)}
                                    >
                                        Poista
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={siirryMaksuun}
                    sx={{ mt: 2 }}
                >
                    Siirry maksamaan
                </Button>
            </Box>
            )}

        </Box>
    );
    
}

export default Myynti;
