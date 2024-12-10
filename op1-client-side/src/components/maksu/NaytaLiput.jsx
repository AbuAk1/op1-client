import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Naytaliput({ liput }) {
    return (
        <TableContainer sx={{ mb: 2 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Lippu</TableCell>
                        {liput[0] && Object.keys(liput[0]).map((key) => (
                            <TableCell key={key}>{key}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {liput.map((lippu, index) => (
                        <TableRow hover key={index}>
                            <TableCell>{`Lippu ${index + 1}`}</TableCell>
                            {Object.entries(lippu).map(([key, value]) => (
                                <TableCell key={key}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}