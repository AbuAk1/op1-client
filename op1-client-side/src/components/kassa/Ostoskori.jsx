import {
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
} from '@mui/material';

export default function Ostoskori({ lisatytLiput, poistaLippu, siirryMaksuun }) {

    return (
        <Box
            sx={{
                mt: 4,
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: 3,
                p: 2,
                maxHeight: '200px',
                overflow: 'auto',
                zIndex: 20,
            }}
        >
            <Typography variant="h6">Ostoskori</Typography>
            <Table sx={{ width: "100%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ padding: '4px 8px' }}>TapahtumaID</TableCell>
                        <TableCell sx={{ padding: '4px 8px' }}>Tapahtuma</TableCell>
                        <TableCell sx={{ padding: '4px 8px' }}>HinnastoID</TableCell>
                        <TableCell sx={{ padding: '4px 8px' }}>Hinta</TableCell>
                        <TableCell sx={{ padding: '4px 8px' }}>Hintaluokka</TableCell>
                        <TableCell sx={{ padding: '4px 8px' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lisatytLiput.map((lippu, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ padding: '4px 8px' }}>{lippu.tapahtumaId}</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>{lippu.tapahtuma}</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>{lippu.hinnastoId}</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>{lippu.hinta}</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>{lippu.hintaluokka}</TableCell>
                            <TableCell sx={{ padding: '4px 8px' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => poistaLippu(index)}
                                >
                                    Poista
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button
                variant="contained"
                color="primary"
                onClick={siirryMaksuun}
                sx={{ mt: 2 }}
            >
                Siirry maksamaan
            </Button>
        </Box>
    )
}