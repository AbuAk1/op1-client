import {
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer
} from '@mui/material';

export default function NaytaTapahtumat({ filteredTapahtumat, setMuokattavaTapahtuma, setTapahtumaModal, avaaHinnastoModal, poistaTapahtuma }) {
    return (
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
                                <TableRow key={tapahtuma.tapahtumaId}>
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
    )
}