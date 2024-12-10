import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import Lippu from "./Lippu"

export default function NaytaMyydytLiput({ myydytLiput, printRef, handlePrint }) {
    return (
        <Box >
            <Typography variant="h6" component="p" >
                Lippuja myyty
            </Typography>
            <div ref={printRef} className="print-container" >
                {myydytLiput.map((lippu) => (
                    <div style={{ margin: '20px 0' }} className="print-item" key={lippu.lippuId}>
                        <Lippu lippu={lippu} />
                    </div>
                ))}
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                style={{ marginTop: "10px" }}
            >
                Tulosta kaikki liput
            </Button>
        </Box>
    )
}