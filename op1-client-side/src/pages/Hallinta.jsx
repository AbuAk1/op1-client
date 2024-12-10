import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { useTapahtumat } from '../hooks/useTapahtumat';
import { useHinnastot } from '../hooks/useHinnastot';
import TapahtumaHaku from '../components/hallinta/TapahtumaHaku';
import NaytaTapahtumat from '../components/hallinta/NaytaTapahtumat';
import HallintaValikko from '../components/hallinta/HallintaValikko';
import TapahtumaModal from '../components/hallinta/TapahtumaModal';
import NaytaHinnastot from '../components/hallinta/NaytaHinnastot';

function Hallinta() {

    // Käytetään useTapahtumat ja useHinnastot hookkeja
    const { avaaTapahtumaModal, handleSearchChange, clearSearch, filteredTapahtumat,
        setMuokattavaTapahtuma, setTapahtumaModal, poistaTapahtuma, tyhjennaTapahtumaKentat,
        uusiTapahtuma, handleChange, muokkaaTapahtumaa, luoUusiTapahtuma, muokattavaTapahtuma,
        tapahtumaModal, searchTerm } = useTapahtumat();

    const { hinnastot, setHinnastot, poistaHinnasto, hinnastoluokka, setHinnastoLuokka, hinta,
        setHinta, luoHinnasto, modalOpen, setModalOpen, avaaHinnastoModal } = useHinnastot();


    // Käytetään navigointia
    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    useEffect(() => {
        // Jos käyttäjä ei ole admin ohjataan takaisin home-sivulle
        if (role !== 'ADMIN') {
            navigate("/home");
        }
    }, []);

    return (
        <>
            <CssBaseline />
            <Box display="flex" sx={{ height: '100vh', width: '100%', gap: 2 }}>

                {/* Valikko */}
                <HallintaValikko navigate={navigate} avaaTapahtumaModal={avaaTapahtumaModal} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: 2,
                }}>
                    {/* Tapahtumien haku */}
                    <TapahtumaHaku searchTerm={searchTerm} handleSearchChange={handleSearchChange} clearSearch={clearSearch} />

                    {/* Näytetään tapahtumat */}
                    <NaytaTapahtumat
                        filteredTapahtumat={filteredTapahtumat}
                        setMuokattavaTapahtuma={setMuokattavaTapahtuma}
                        setTapahtumaModal={setTapahtumaModal}
                        avaaHinnastoModal={avaaHinnastoModal}
                        poistaTapahtuma={poistaTapahtuma}
                    />
                </Box>
            </Box>

            {/*Tapahtuma modal*/}
            <TapahtumaModal
                tapahtumaModal={tapahtumaModal}
                tyhjennaTapahtumaKentat={tyhjennaTapahtumaKentat}
                setTapahtumaModal={setTapahtumaModal}
                uusiTapahtuma={uusiTapahtuma}
                handleChange={handleChange}
                muokkaaTapahtumaa={muokkaaTapahtumaa}
                luoUusiTapahtuma={luoUusiTapahtuma}
                muokattavaTapahtuma={muokattavaTapahtuma}
            />

            {/* Hinnasto modal */}
            <NaytaHinnastot
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setHinnastot={setHinnastot}
                hinnastot={hinnastot}
                poistaHinnasto={poistaHinnasto}
                hinnastoluokka={hinnastoluokka}
                setHinnastoLuokka={setHinnastoLuokka}
                hinta={hinta}
                setHinta={setHinta}
                luoHinnasto={luoHinnasto}
            />
        </>
    );
}

export default Hallinta;
