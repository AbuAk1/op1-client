import {
    Button,
    TextField,
    Typography,
    Box,
    Modal
} from '@mui/material';

export default function TapahtumaModal({ tapahtumaModal, tyhjennaTapahtumaKentat, setTapahtumaModal, uusiTapahtuma, handleChange, muokkaaTapahtumaa, luoUusiTapahtuma, muokattavaTapahtuma }) {

    return (
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
                                : luoUusiTapahtuma(uusiTapahtuma)
                        }
                        variant="contained"
                        color="primary"
                    >
                        {muokattavaTapahtuma ? 'Päivitä tapahtuma' : 'Tallenna tapahtuma'}
                    </Button>

                </Box>
            </Box>
        </Modal>
    )

}