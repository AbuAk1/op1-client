import {
    Button,
    Typography,
    Card,
    CardActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Maksutapahtumat({ maksu, haeMaksutapahtumanLiput, maksutapahtumanLiput, avaaDialog }) {
    return (
        <Card sx={{ margin: 3, borderRadius: 2, padding: 3, width: 450 }}>
            <Typography variant="h6">
                Maksutapahtuma {maksu.maksutapahtumaId}
            </Typography>
            <Typography>
                <strong>Aikaleima: </strong>{maksu.aikaleima}
            </Typography>
            <Typography>
                <strong>Hinta: </strong> {maksu.hintayhteensa} €
            </Typography>
            <Typography>
                <strong>Myyjä: </strong> {maksu.kayttaja.kayttajaId}
            </Typography>

            <Accordion sx={{ m: 1, boxShadow: 'none' }}
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
                                <Typography key={lippu.lippuId}>
                                    <strong>Lippu: </strong> {lippu.lippuId}, <strong>Hinta: </strong> {lippu.hinnasto.hinta} € {lippu.hinnasto.hintaluokka},
                                    <strong>Tapahtuma: </strong>{lippu.tapahtuma.nimi}</Typography>
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
                    sx={{ backgroundColor: 'red', ":hover": { backgroundColor: 'darkred' }, borderRadius: 5 }}
                    onClick={() => avaaDialog(maksu.maksutapahtumaId, maksu.hintayhteensa)}>
                    Peruuta maksutapahtuma
                </Button>
            </CardActions>
        </Card>
    )
}