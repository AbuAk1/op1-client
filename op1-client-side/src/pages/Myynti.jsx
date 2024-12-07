import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
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
    AccordionDetails,
    Paper,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,

} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


function Myynti() {
    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
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
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEnDate] = useState(dayjs());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [maksuId, setMaksuId] = useState(null);
    const [palautusSumma, setPalautusSumma] = useState(0);
    const [haetutMaksutapahtumat, setHaetutMaksutapahtumat] = useState([]);

    const navigate = useNavigate();

    // päivitetään tapahtumiin myytyjen lippujen määrä
    useEffect(() => {
        const lisaaMyydytLiput = async () => {
            const tapahtumatKopio = [...tapahtumat];

            const tapahtumatMyydyillaLipuilla = await Promise.all(
                tapahtumatKopio.map(async (tapahtuma) => {
            
                    if (tapahtuma.myydytLiput == null) {
                        const myydytliput = await haeTapahtumanLiput(tapahtuma.tapahtumaId); // haetaan myytyjen lippujen määrä
                        return { ...tapahtuma, myydytLiput: myydytliput }; // Päivitä myydyt liput
                    }
                    return tapahtuma;
                })
            );

            if (JSON.stringify(tapahtumat) !== JSON.stringify(tapahtumatMyydyillaLipuilla)) {
                setTapahtumat(tapahtumatMyydyillaLipuilla);
            }
        };

        lisaaMyydytLiput();
    }, [tapahtumat]);

    // haetaan kaikki tapahtumat
    const haeTapahtumat = async () => {

        // alustetaan maksutapahtumat tyhjiksi
        setMaksutapahtumat([])

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
                // lisätään tapahtumat tapahtuma stateen
                setTapahtumat(data);

            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // hakee hinnastot yhdelle tapahtumalle
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
                // asetetaan hinnastot state
                setHinnastot(data);
                return data;
            } else {
                console.error('Virhe hinnastojen haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // hakee yhden hinnaston hinnastoid:llä
    const haeYksiHinnasto = async (hinnastoId) => {
        try {
            const response = await fetch(
                `${url}/api/hinnastot/${hinnastoId}`,
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

    // hakee tapahtuman lippumäärän jotka ei ole removed
    const haeTapahtumanLiput = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}/liput`,
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
                } 
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    };

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

    // lisää lipun
    const lisaaLippu = async () => {


        if (selectedTapahtuma.lippumaara - lisatytLiput.length == 0) {
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

    /*
        Tässä blokissa on maksutapahtuviin
         liittyvät funktiot
    */

    // haetaan maksutapahtumat
    const haeMaksutapahtumat = async () => {

        setTapahtumat([])

        try {
            const response = await fetch(
                `${url}/api/maksutapahtumat`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

            if (response.ok) {
                const data = await response.json();
                const suodatetutTapahtumat = data.filter((tapahtuma) => !tapahtuma.removed).reverse();
                setMaksutapahtumat(suodatetutTapahtumat);
                setHaetutMaksutapahtumat(suodatetutTapahtumat);
                await haeLiput();
            } else {
                const errorData = await response.json();
                console.error("Virhe maksutapahtumien haussa", errorData)
                alert('Maksutapahtumia ei löytynyt.')
                
            }
        } catch (error) {
            console.error("Virhe maksutapahtumapyynnön aikana:", error);
            alert('Maksutapahtumia ei voitu hakea tietokannasta.')
        }
    }

    // suodatetaan maksutapahtumat
    const suodataMaksutapahtumat = () => {

        if (!startDate || !endDate) {
            alert("Valitse aikaväli.");
            return;
        }

        const suodatetutTapahtumat = maksutapahtumat.filter((maksu) => {
            const maksuDate = dayjs(maksu.aikaleima);
            const start = dayjs(startDate).startOf('day');
            const end = dayjs(endDate).endOf('day');

            return maksuDate.isBetween(start, end, null, '[]');
        })

        if (!suodatetutTapahtumat || suodatetutTapahtumat <= 0) {

            alert('Maksutapahtumia ei löytynyt kyseisellä aikavälillä. Näytetään kaikki maksutapahtumat.')
            haeMaksutapahtumat();
        }

        setHaetutMaksutapahtumat(suodatetutTapahtumat);
    }

    // haetaan liput
    const haeLiput = async () => {
        try {
            const response = await fetch(
                `${url}/api/liput`,
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
            } else {
                const errorData = await response.json();
                console.error("Virhe lippujen haussa", errorData);
                alert('Lippujen haku epäonnistui.')
            }
        } catch (error) {
            console.error("Virhe lippupyynnön aikana: ", error)
            alert('Lippuja ei voitu noutaa tietokannasta.')
        }
    };

    // haetaan maksutapahtuman liput ja asetetaan ne stateen
    const haeMaksutapahtumanLiput = async (id) => {

        const suodatetutLiput = liput.filter((lippu) =>
            lippu.maksutapahtuma && lippu.maksutapahtuma.maksutapahtumaId === id
        );

        setMaksutapahtumanLiput((prevState) => ({
            ...prevState,
            [id]: suodatetutLiput,
        }));

        return suodatetutLiput;
    }

    //poistetaan maksutapahtuma
    const poistaMaksutapahtuma = async (id) => {

        try {
            const response = await fetch(
                `${url}/api/maksutapahtumat/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

            if (response.ok) {
                await poistaMaksutapahtumanLiput(id);
                await haeMaksutapahtumat();
                setMaksutapahtumanLiput({});
            } else {
                const errorData = await response.json();
                console.error("DELETE MAKSUTAPAHTUMA Virhe maksutapahtuman poistossa", errorData)
                alert('DELETE MAKSUTAPAHTUMA  Maksutapahtumaa ei voitu poistaa.')
            }
        } catch (error) {
            console.error("DELETE MAKSUTAPAHTUMA  Virhe maksutapahtuman poistopyynnön aikana:", error);
            alert('DELETE MAKSUTAPAHTUMA  Maksutapahtumaa ei voitu poistaa.')
        }

        setDialogOpen(false);

    }

    /*
        poistetaan lippu soft deletellä, jotta se voidaan taas myydä uudestaan.
        Siitä jää kuitenkin merkintä tietokantaan, palautetut liput on removed true.
    */
    const poistaMaksutapahtumanLiput = async (id) => {

        let poistettavatLiput = await haeMaksutapahtumanLiput(id);

        for (let i = 0; i< poistettavatLiput.length; i++ ) {

            try {
                const response = await fetch(
                    `${url}/api/liput/softdelete/${poistettavatLiput[i].lippuId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                if (response.ok) {
                    alert(`Lippu ${i+1} palautettu takaisin myyntiin`);
                } else {
                    alert('Lipun palauttamisessa virhe');
                }
            } catch (error) {
                console.error("Virhe lipun palautuksessa: ", error);
            }
        }

    }

    const avaaDialog = (maksutaphtumaId, summa) => {
        setMaksuId(maksutaphtumaId);
        setPalautusSumma(summa);
        setDialogOpen(true);
    }

    const suljeDialog = () => setDialogOpen(false)

    const tulostaLiput = async (tapahtuma) => {
        //loopataan niin monta kertaa kun lippuja on jäljellä tapahtumassa
        
        let lippujaJaljella = tapahtuma.lippumaara - tapahtuma.myydytLiput;

        const tapahtumanHinnastot = await haeHinnastot(tapahtuma.tapahtumaId);
        const ovimyyntiHinta = tapahtumanHinnastot.filter(h => h.hintaluokka == "ovimyynti")[0]; //kovakoodaatu vain ensimmäinen ovihinta!
        
        
        if (!ovimyyntiHinta) {
            alert('ovimyyntihintaa ei ole määritelty, palaa hallintaan tekemään ovihinta tapahtumalle');
            return;
        }

        for (let i = 0; i < lippujaJaljella; i++) {

            const uusiLippu = {
                tapahtumaId: tapahtuma.tapahtumaId,
                tapahtuma: tapahtuma.nimi,
                hinnastoId: ovimyyntiHinta.hinnastoid,
                hinta: ovimyyntiHinta.hinta,
                hintaluokka: ovimyyntiHinta.hintaluokka,
            };
            setLisatytLiput((prev) => [...prev, uusiLippu]);

        }
    }

    return (
        <Box sx={{ m: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                Takaisin
            </Button>
            <Button variant="contained" color="primary" onClick={haeTapahtumat} sx={{ mr: 1 }}>
                Hae tapahtumat
            </Button>
            <Button variant="contained" color="primary" onClick={haeMaksutapahtumat}>
                Hae maksutapahtumat
            </Button>

            {/* Tapahtumat */}
            <Box sx={{ padding: '20px 20px 200px 20px', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {tapahtumat
                    // tapahtuma ei saa olla menneisyydessä
                    .filter((tap) => !(new Date(tap.aika) < new Date()))
                    .map((tap) => (
                        <Card key={tap.tapahtumaId} sx={{ width: 320, mb: 2, padding: '30px', borderRadius: '20px' }}>
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
                                    <strong>Lippumäärä:</strong> {tap.lippumaara}
                                </Typography>
                                <Typography>
                                    <strong>Lippuja jäljellä:</strong> {tap.lippumaara - tap.myydytLiput}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {new Date(tap.ennakkomyynti) > new Date() && (
                                    <Button
                                        disabled={tap.lippumaara - tap.myydytLiput <= 0}
                                        variant="outlined"
                                        onClick={() => avaaModal(tap)}
                                    >
                                        Myy lippuja
                                    </Button>
                                )}
                                {(tap.lippumaara - tap.myydytLiput > 0 && new Date(tap.ennakkomyynti) <= new Date()) && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => tulostaLiput(tap)}
                                    >
                                        Tulosta loput liput
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    ))}
            </Box>

            {/* filter */}
            {maksutapahtumat && maksutapahtumat.length > 0 && (
                <Box sx={{ marginTop: -25, display: 'flex', flexWrap: 'wrap' }}>

                    <Box sx={{ width: 1250, height: 75, textAlign: 'center', display: 'flex', alignItems: 'center', m: '40px 0'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Alkupäivämäärä"
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                format="DD/MM/YYYY"
                                sx={{ marginRight: 2, marginLeft: 2 }} />
                            <Typography variant='h6'><strong>-</strong></Typography>
                            <DatePicker
                                label="Loppupäivämäärä"
                                value={endDate}
                                onChange={(date) => setEnDate(date)}
                                format="DD/MM/YYYY"
                                sx={{ marginLeft: 2, marginRight: 2 }} />
                            <Button variant='contained' onClick={suodataMaksutapahtumat} sx={{marginRight: 2, backgroundColor: 'green', borderRadius: 5, ":hover": { backgroundColor: 'darkgreen'}}}>Hae</Button>
                            <Button variant='contained' onClick={haeMaksutapahtumat} sx={{marginRight: 2, borderRadius: 5}}>Näytä kaikki</Button>
                        </LocalizationProvider>
                    </Box>

                    {/* maksutapahtumat */}
                    {haetutMaksutapahtumat.map((maksu) => (
                        <Card key={maksu.maksutapahtumaId} sx={{ margin: 3, borderRadius: 2, padding: 3, width: 450 }}>
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

                            <Accordion sx={{ m: 1, boxShadow: 'none'}}
                                onChange={() => haeMaksutapahtumanLiput(maksu.maksutapahtumaId)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <strong>Näytä liput</strong>
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


                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    sx={{ backgroundColor: 'red', ":hover": { backgroundColor: 'darkred'}, borderRadius: 5}}
                                    onClick={() => avaaDialog(maksu.maksutapahtumaId, maksu.hintayhteensa)}>
                                    Peruuta maksutapahtuma
                                </Button>
                            </CardActions>
                        </Card>
                    ))}

                    {/* vahvistus */}
                    <Dialog open={dialogOpen} onClose={suljeDialog} PaperProps={{sx:{borderRadius: 5, padding: 2}}}>
                        <DialogTitle>Vahvista maksutapahtuman peruutus</DialogTitle>
                        <DialogContent>
                        <DialogContentText sx={{color: 'black'}}>Haluatko varmasti peruuttaa maksutapahtuman lippuineen?</DialogContentText>
                        <DialogContentText sx={{color: 'black'}}><strong>Palautettava summa:</strong> {palautusSumma} €</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => poistaMaksutapahtuma(maksuId)} variant='contained' sx={{borderRadius: 5}}>Vahvista</Button>
                            <Button onClick={suljeDialog}
                            variant='contained'
                            sx={{backgroundColor: 'red', ":hover": { backgroundColor: 'darkred' }, borderRadius: 5}}>
                            Peruuta</Button>
                        </DialogActions>

                    </Dialog>

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
                            {hinnastot
                            .filter((h) => h.hintaluokka !== 'ovimyynti') // Suodatetaan 'ovimyynti' pois
                            .map((h) => (
                                <MenuItem key={h.hinnastoid} value={h.hinnastoid}>
                                {h.hintaluokka} - {h.hinta} €
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedTapahtuma && (selectedTapahtuma.lippumaara - selectedTapahtuma.myydytLiput) - lisatytLiput.length == 0 && (
                        <Typography variant="h6" gutterBottom color="error">Liput ovat loppuunmyyty</Typography>)}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={lisaaLippu}
                        fullWidth
                        disabled={
                            selectedTapahtuma &&
                            (selectedTapahtuma.lippumaara - selectedTapahtuma.myydytLiput) - lisatytLiput.length == 0
                         }
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
