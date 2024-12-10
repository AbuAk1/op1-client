import {
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';

export default function Tapahtumat({ tapahtumat, avaaModal, tulostaLiput }) {
    return (
        <Box sx={{ padding: '20px 20px 200px 20px', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {tapahtumat
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
    )
}