import { Button, Typography, Box } from '@mui/material';

export default function LipunNaytto({ lippu, kaytaLippu, peruutaKaytto }) {
    return (
        <Box mt={2}>
            {lippu ? (
                <div>
                    <Typography variant='h5' sx={{ marginTop: 7, marginBottom: 1 }}>Lipun tiedot:</Typography>
                    <Typography variant="body1">LippuId: {lippu.lippuId}</Typography>
                    <Typography variant="body1">Tapahtuman nimi: {lippu.tapahtuma.nimi}</Typography>
                    <Typography variant="body1">Tapahtuman ajankohta: {lippu.tapahtuma.aika}</Typography>
                    <Typography variant="body1">Hintaluokka: {lippu.hinnasto.hintaluokka}</Typography>
                    <Typography variant="body1">Käytetty: {lippu.kaytetty.toString()}</Typography>

                    {lippu.kaytetty && (
                        <Typography variant="body1" color="error" sx={{ fontWeight: 'bold', marginBottom: 5 }} mt={3}>
                            Tämä lippu on jo käytetty.
                        </Typography>
                    )}

                    {lippu.removed ? (
                        <Typography variant="body2" color="error" mt={3}>
                            Tämä lippu on poistettu tai palautettu, eikä sitä voi käyttää.
                        </Typography>
                    ) : (
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={kaytaLippu}
                                disabled={lippu.kaytetty}
                            >
                                Merkitse käytetyksi
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={peruutaKaytto}
                                sx={{ marginLeft: 2 }}
                            >
                                Palauta käyttämättömäksi
                            </Button>
                        </Box>
                    )}
                </div>
            ) : (
                <Typography variant="body2" color="textSecondary" mt={3}>
                    Ei haettuja tietoja.
                </Typography>
            )}
        </Box>
    )
}