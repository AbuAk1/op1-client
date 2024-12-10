import {
    Button,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
} from '@mui/material';

export default function PoistoDialog({ dialogOpen, suljeDialog, palautusSumma, poistaMaksutapahtuma }) {
    return (
        <Dialog open={dialogOpen} onClose={suljeDialog} PaperProps={{ sx: { borderRadius: 5, padding: 2 } }}>
            <DialogTitle>Vahvista maksutapahtuman peruutus</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'black' }}>Haluatko varmasti peruuttaa maksutapahtuman lippuineen?</DialogContentText>
                <DialogContentText sx={{ color: 'black' }}><strong>Palautettava summa:</strong> {palautusSumma} €</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={poistaMaksutapahtuma} variant='contained' sx={{ borderRadius: 5 }}>Vahvista</Button>
                <Button onClick={suljeDialog}
                    variant='contained'
                    sx={{ backgroundColor: 'red', ":hover": { backgroundColor: 'darkred' }, borderRadius: 5 }}>
                    Peruuta</Button>
            </DialogActions>

        </Dialog>
    )
}