import { Button, TextField, Box } from '@mui/material';

export default function TapahtumaHaku({ searchTerm, handleSearchChange, clearSearch }) {
    return (
        <Box sx={{
            display: 'flex',
            backgroundColor: '#f9f9f9',
            padding: '40px 30px',
            borderRadius: 5,
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
            alignItems: 'center',
            gap: 2,
        }}>
            <TextField
                label="Hae tapahtumaa nimellä"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <Button
                variant="contained"
                onClick={clearSearch}
                sx={{ height: '100%', whiteSpace: 'nowrap', }}
            >
                Poista haku
            </Button>
        </Box>
    )
}