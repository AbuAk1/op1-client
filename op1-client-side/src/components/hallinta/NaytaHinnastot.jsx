import {
    Button,
    TextField,
    Typography,
    Box,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer,
    CssBaseline
} from '@mui/material';

export default function NaytaHinnastot({ modalOpen, setModalOpen, setHinnastot, hinnastot, poistaHinnasto, hinnastoluokka, setHinnastoLuokka, hinta, setHinta, luoHinnasto }) {
    return (
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
    )
}