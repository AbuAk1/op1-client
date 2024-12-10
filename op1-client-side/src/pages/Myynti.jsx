import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { useMaksutapahtumat } from '../hooks/useMaksutapahtumat';
import { useKassa } from '../hooks/useKassa';
import Ostoskori from '../components/kassa/Ostoskori';
import Maksutapahtumat from '../components/maksutapahtuma/Maksutapahtumat';
import PoistoDialog from '../components/maksutapahtuma/PoistoDialog';
import MaksutapahtumaHaku from '../components/maksutapahtuma/MaksutapahtumaHaku';
import Lipunvalinta from '../components/kassa/LipunValinta';
import Tapahtumat from '../components/kassa/Tapahtumat';


function Myynti() {

    // Käytetään luotuja hookkeja
    const { suodataMaksutapahtumat, haeMaksutapahtumat, haetutMaksutapahtumat,
        maksutapahtumanLiput, palautusSumma, avaaDialog, suljeDialog, poistaMaksutapahtuma,
        dialogOpen, maksutapahtumat, setStartDate, setEndDate, startDate, endDate,
        haeMaksutapahtumanLiput, tyhjennaMaksutapahtumat } = useMaksutapahtumat();

    const { haeTapahtumat, tapahtumat, avaaModal, tulostaLiput,
        suljeModal, modalOpen, setSelectedHintaluokka, selectedHintaluokka, hinnastot,
        selectedTapahtuma, lisaaLippu, lisatytLiput, tyhjennaTapahtumat, poistaLippu } = useKassa();

    // Käytetään navigointia
    const navigate = useNavigate();

    const siirryMaksuun = () => {
        navigate('/maksu', { state: { lisatytLiput } });
    };

    return (
        <Box sx={{ m: 2 }}>

            {/* Navigointi myyntisivulla */}
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                Takaisin
            </Button>
            <Button variant="contained" color="primary" onClick={() => { tyhjennaMaksutapahtumat(); haeTapahtumat(); }} sx={{ mr: 1 }}>
                Hae tapahtumat
            </Button>
            <Button variant="contained" color="primary" onClick={() => { tyhjennaTapahtumat(); haeMaksutapahtumat(); }}>
                Hae maksutapahtumat
            </Button>

            {/* Näytetään tulevat tapahtumat */}
            <Tapahtumat
                tapahtumat={tapahtumat}
                avaaModal={avaaModal}
                tulostaLiput={tulostaLiput}
            />

            {/* Näytetään maksutapahtumat, mikäli maksutapahtumat ei ole null ja niitä on enemmän kuin 0 */}
            {maksutapahtumat && maksutapahtumat.length > 0 && (
                <Box sx={{ marginTop: -28, display: 'flex', flexWrap: 'wrap' }}>

                    <MaksutapahtumaHaku startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        suodataMaksutapahtumat={suodataMaksutapahtumat}
                        haeMaksutapahtumat={haeMaksutapahtumat} />

                    {/* Mapataan maksutapahtumat */}
                    {haetutMaksutapahtumat.map((maksu) => (
                        <Maksutapahtumat
                            key={maksu.maksutapahtumaId}
                            maksu={maksu}
                            haeMaksutapahtumanLiput={haeMaksutapahtumanLiput}
                            maksutapahtumanLiput={maksutapahtumanLiput}
                            avaaDialog={avaaDialog} />
                    ))}

                    {/* vahvistus */}
                    <PoistoDialog dialogOpen={dialogOpen}
                        suljeDialog={suljeDialog}
                        palautusSumma={palautusSumma}
                        poistaMaksutapahtuma={poistaMaksutapahtuma} />
                </Box>
            )}

            {/* Avaa modalin, josta voi lisätä lippuja ostoskoriin */}
            <Lipunvalinta
                modalOpen={modalOpen}
                suljeModal={suljeModal}
                selectedTapahtuma={selectedTapahtuma}
                selectedHintaluokka={selectedHintaluokka}
                setSelectedHintaluokka={setSelectedHintaluokka}
                hinnastot={hinnastot}
                lisatytLiput={lisatytLiput}
                lisaaLippu={lisaaLippu}
            />

            {/* Näytetään ostoskori jos on lisättyjä lippuja */}
            {lisatytLiput.length > 0 && (
                <Ostoskori lisatytLiput={lisatytLiput} poistaLippu={poistaLippu} siirryMaksuun={siirryMaksuun} />
            )}

        </Box>
    );
}

export default Myynti;