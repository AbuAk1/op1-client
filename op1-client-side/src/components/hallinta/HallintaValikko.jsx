import { Button, Box } from '@mui/material';

export default function HallintaValikko({ navigate, avaaTapahtumaModal }) {
    return (
        <Box sx={{
            width: { xs: '100%', md: '20%' },
            backgroundColor: '#f9f9f9',
            padding: 2,
            borderRadius: 6,
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
        }}>
            <Button variant="outlined" color="primary" onClick={() => navigate(-1)} sx={{ mb: 5, mt: 2 }} size='small'>
                Takaisin Valikkoon
            </Button>
            <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                onClick={avaaTapahtumaModal}>
                Lisää Tapahtuma +
            </Button>
            <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                onClick={() => navigate("/Raporttisivu")}>
                Raportit
            </Button>
            <Button variant="contained" color="primary" sx={{ mb: 1 }} size='small'
                onClick={() => alert('Käyttäjien hallinta tulossa myöhemmin')}>
                Hallinnoi käyttäjiä
            </Button>
        </Box>
    )
}