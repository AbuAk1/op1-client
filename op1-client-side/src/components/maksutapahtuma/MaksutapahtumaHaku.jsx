import {
    Button,
    Typography,
    Box,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MaksutapahtumaHaku({ startDate, setStartDate, endDate, setEndDate, suodataMaksutapahtumat, haeMaksutapahtumat }) {

    return (
        <Box sx={{ width: 1250, height: 75, textAlign: 'center', display: 'flex', alignItems: 'center', m: '40px 0', marginBottom: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Alkupäivämäärä"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    format="DD/MM/YYYY"
                    sx={{ marginRight: 2, marginLeft: 2 }} />
                <Typography variant='h6'><strong>-</strong></Typography>
                <DatePicker
                    label="Loppupäivämäärä"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    format="DD/MM/YYYY"
                    sx={{ marginLeft: 2, marginRight: 2 }} />
                <Button variant='contained' onClick={suodataMaksutapahtumat} sx={{ marginRight: 2, backgroundColor: 'green', borderRadius: 5, ":hover": { backgroundColor: 'darkgreen' } }}>Hae</Button>
                <Button variant='contained' onClick={haeMaksutapahtumat} sx={{ marginRight: 2, borderRadius: 5 }}>Näytä kaikki</Button>
            </LocalizationProvider>
        </Box>
    )
}