import { useState, useEffect } from "react";
import { useMaksutapahtumat } from "./useMaksutapahtumat";

//Funktiot tapahtumien näyttämiseen ja myymiseen
export function useKassa() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem('token');
    const [tapahtumat, setTapahtumat] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTapahtuma, setSelectedTapahtuma] = useState(null);
    const [hinnastot, setHinnastot] = useState([]);
    const [selectedHintaluokka, setSelectedHintaluokka] = useState('');
    const [lisatytLiput, setLisatytLiput] = useState([]);

    // Päivitetään tapahtumiin myytyjen lippujen määrä
    useEffect(() => {
        const lisaaMyydytLiput = async () => {
            const tapahtumatKopio = [...tapahtumat];

            const tapahtumatMyydyillaLipuilla = await Promise.all(
                tapahtumatKopio.map(async (tapahtuma) => {

                    if (tapahtuma.myydytLiput == null) {
                        const myydytliput = await haeTapahtumanLiput(tapahtuma.tapahtumaId); // haetaan myytyjen lippujen määrä
                        return { ...tapahtuma, myydytLiput: myydytliput }; // Päivitä myydyt liput
                    }
                    return tapahtuma;
                })
            );

            if (JSON.stringify(tapahtumat) !== JSON.stringify(tapahtumatMyydyillaLipuilla)) {
                setTapahtumat(tapahtumatMyydyillaLipuilla);
            }
        };

        lisaaMyydytLiput();
    }, [tapahtumat]);

    // Haetaan kaikki tapahtumat
    const haeTapahtumat = async () => {

        try {
            const response = await fetch(
                `${url}/api/tapahtumat`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                // Tallennetaan tapahtumat
                setTapahtumat(data);

            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Haetaan hinnastot yhdelle tapahtumalle
    const haeHinnastot = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}/hinnastot`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                // asetetaan hinnastot state
                setHinnastot(data);
                return data;
            } else {
                console.error('Virhe hinnastojen haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Haetaan yksi hinnasto hinnastoid:llä
    const haeYksiHinnasto = async (hinnastoId) => {
        try {
            const response = await fetch(
                `${url}/api/hinnastot/${hinnastoId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                return data;

            } else {
                console.error('Virhe hinnastojen haussa');
                return null;
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
            return null;
        }
    };

    // Haetaan tapahtuman lippumäärä suodattaen poistetut liput
    const haeTapahtumanLiput = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}/liput`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    return data.length;
                }
            } else {
                return 0;
            }
        } catch (error) {
            return 0;
        }
    };

    // Avataan modal
    const avaaModal = (tapahtuma) => {
        setSelectedTapahtuma(tapahtuma);
        setSelectedHintaluokka('');
        haeHinnastot(tapahtuma.tapahtumaId);
        setModalOpen(true);
    };

    // Suljetaan modal
    const suljeModal = () => {
        setModalOpen(false);
        setSelectedTapahtuma(null);
        setHinnastot([]);
    };

    // Lisätään lippu
    const lisaaLippu = async () => {


        if (selectedTapahtuma.lippumaara - lisatytLiput.length == 0) {
            return;
        }

        if (!selectedHintaluokka) {
            alert('Valitse hintaluokka ennen lisäämistä!');
            return;
        }

        // Odota hinnan saamista asynkronisesti
        const hintaTiedot = await haeYksiHinnasto(selectedHintaluokka);

        if (hintaTiedot === null) {
            alert('Hinnan hakeminen epäonnistui!');
            return;
        }

        // Luo uusi lippu objektin, kun hinta on saatu
        const uusiLippu = {
            tapahtumaId: selectedTapahtuma.tapahtumaId,
            tapahtuma: selectedTapahtuma.nimi,
            hinnastoId: selectedHintaluokka,
            hinta: hintaTiedot.hinta,
            hintaluokka: hintaTiedot.hintaluokka,
        };

        setLisatytLiput((prev) => [...prev, uusiLippu]);
        suljeModal();
    };

    // Poistetaan lippu
    const poistaLippu = (index) => {
        setLisatytLiput((prevLiput) => prevLiput.filter((_, i) => i !== index));
    };

    // Asetetaan lisättyihin lippuihin kaikki liput, mikäli ne halutaan tulostaa
    const tulostaLiput = async (tapahtuma) => {

        let lippujaJaljella = tapahtuma.lippumaara - tapahtuma.myydytLiput;

        const tapahtumanHinnastot = await haeHinnastot(tapahtuma.tapahtumaId);
        const ovimyyntiHinta = tapahtumanHinnastot.filter(h => h.hintaluokka == "ovimyynti")[0]; //kovakoodaatu vain ensimmäinen ovihinta!


        if (!ovimyyntiHinta) {
            alert('ovimyyntihintaa ei ole määritelty, palaa hallintaan tekemään ovihinta tapahtumalle');
            return;
        }

        for (let i = 0; i < lippujaJaljella; i++) {

            const uusiLippu = {
                tapahtumaId: tapahtuma.tapahtumaId,
                tapahtuma: tapahtuma.nimi,
                hinnastoId: ovimyyntiHinta.hinnastoid,
                hinta: ovimyyntiHinta.hinta,
                hintaluokka: ovimyyntiHinta.hintaluokka,
            };
            setLisatytLiput((prev) => [...prev, uusiLippu]);

        }
    }

    // Tyhjennetään tapahtumat
    const tyhjennaTapahtumat = () => setTapahtumat([]);

    return {
        haeTapahtumat, tapahtumat, avaaModal, tulostaLiput,
        suljeModal, modalOpen, setSelectedHintaluokka, selectedHintaluokka, hinnastot,
        selectedTapahtuma, lisaaLippu, lisatytLiput, tyhjennaTapahtumat, poistaLippu
    };

}