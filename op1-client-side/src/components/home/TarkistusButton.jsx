import { Button } from '@mui/material';
import { Box } from '@mui/material';
import ticketCheckImage from '../../images/ticketcheck.jpg';

export default function Tarkistusbutton({ navigate }) {

    return (
        <Button
            onClick={() => navigate("/tarkistus")}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '300px',
                height: '350px',
                backgroundImage: `url(${ticketCheckImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 5,
                '&:hover': {
                    opacity: 0.9,
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Himmentää taustan
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                }}
            >
                Siirry Tarkistukseen
            </Box>
        </Button>
    )

}