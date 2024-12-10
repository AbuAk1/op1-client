import { useNavigate } from "react-router-dom";
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { useMaksu } from "../hooks/useMaksu";
import Naytaliput from "../components/maksu/NaytaLiput";
import NaytaMyydytLiput from "../components/maksu/NaytaMyydytLiput";

function Maksu() {

    // Käytetään navigointi-hookkia
    const navigate = useNavigate();

    // Käytetään usemaksu-hookkia
    const { liput, yhteishinta, paymentCreated, laskuta, printRef, myydytLiput, handlePrint } = useMaksu();

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Maksu
            </Typography>

            {/* Navigointi takaisin edelliselle sivulle */}
            <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    marginBottom: 2,
                    zIndex: 100,
                    borderRadius: '8px',
                }}
            >
                Takaisin
            </Button>

            {/* Näytetään ostettavat  liput, ja tarkistetaan ettei se ole null tai määrä alle 0 */}
            {liput && liput.length > 0 ? (
                <Naytaliput liput={liput} />
            ) : (
                <Typography variant="body1">Ei saatavilla tietoja maksua varten.</Typography>
            )}
            <Box>
                <Typography sx={{ marginBottom: '30px' }}>Hinta yhteensä: <b style={{ fontSize: '20px' }}>{yhteishinta}€</b></Typography>
            </Box>

            <Button disabled={paymentCreated} variant="contained" color="primary" onClick={laskuta} sx={{ marginBottom: 2 }}>
                Laskuta ja tulosta liput
            </Button>

            {/* Näytetään myydyt liput ja tarkistetaan, että niiden määrä on yli 0 */}
            {myydytLiput.length > 0 ? (
                <NaytaMyydytLiput myydytLiput={myydytLiput} printRef={printRef} handlePrint={handlePrint} />
            ) : (
                <Typography variant="body1">Ei lippuja vielä myyty</Typography>
            )}
        </Box>
    );

}

export default Maksu;
