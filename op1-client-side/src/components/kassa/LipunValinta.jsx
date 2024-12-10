import {
    Button,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal,
} from '@mui/material';

export default function Lipunvalinta({ modalOpen, suljeModal, selectedTapahtuma, selectedHintaluokka, setSelectedHintaluokka, hinnastot, lisatytLiput, lisaaLippu }) {

    return (
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
    )
}