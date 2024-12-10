import { useState, useEffect } from 'react';
import { useHinnastot } from './useHinnastot';

// Funktiot tapahtumien hallintaan
export function useTapahtumat() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState([]);
    const [muokattavaTapahtuma, setMuokattavaTapahtuma] = useState(null);
    const [tapahtumaModal, setTapahtumaModal] = useState(false);
    const [filteredTapahtumat, setFilteredTapahtumat] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { setHinnastot } = useHinnastot();

    const [uusiTapahtuma, setUusiTapahtuma] = useState({
        id: "",
        nimi: "",
        aika: "",
        paikka: "",
        kuvaus: "",
        lippumaara: 0,
        ennakkomyynti: ""
    });

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
                setTapahtumat(data);
                setFilteredTapahtumat(data);
            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Poistetaan tapahtuma
    const poistaTapahtuma = async (tapahtumaId) => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${tapahtumaId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                // Poista tapahtuma filteredTapahtumat-taulukosta
                setFilteredTapahtumat(prevFiltered =>
                    prevFiltered.filter(tapahtuma => tapahtuma.tapahtumaId !== tapahtumaId)
                );
                alert('Tapahtuma poistettu');
            } else {
                alert('Et voi poistaa tapahtumaa jossa on lippuja tai hinnastoja');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Haetaan tapahtumat kun sivu renderöidään
    useEffect(() => {
        haeTapahtumat();
    }, []);

    // Asetetaan tapahtuma muokattavaksi
    useEffect(() => {
        if (muokattavaTapahtuma) {
            setUusiTapahtuma(muokattavaTapahtuma);
        }
    }, [muokattavaTapahtuma]);

    // Suodatetaan tapahtumat käyttäjän syötteen mukaan
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filtered = tapahtumat.filter(tapahtuma =>
            tapahtuma.nimi.toLowerCase().includes(value.toLowerCase()) // Suodatus tapahtuman nimen perusteella
        );
        setFilteredTapahtumat(filtered);
    };

    // Tyhjennetään haku
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredTapahtumat(tapahtumat);
    };

    // Avaan modal tapahtumien muookkaamiselle
    const avaaTapahtumaModal = () => {
        setTapahtumaModal(true);
    };

    // Tyhjennetään muokatun tapahtuman kentät
    const tyhjennaTapahtumaKentat = () => {
        setUusiTapahtuma({
            id: "",
            nimi: "",
            aika: "",
            paikka: "",
            kuvaus: "",
            lippumaara: 0,
            ennakkomyynti: ""
        });
        setMuokattavaTapahtuma(null);
    };

    // Asetetaan uuden tapahtuman tiedot
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUusiTapahtuma((prevState) => {
            const newState = { ...prevState, [name]: value };
            return newState;
        });
    };

    // Luodaan uusi tapahtuma
    const luoUusiTapahtuma = async (uusiTapahtuma) => {

        if (
            !uusiTapahtuma.nimi ||
            !uusiTapahtuma.paikka ||
            !uusiTapahtuma.kuvaus ||
            !uusiTapahtuma.aika ||
            !uusiTapahtuma.ennakkomyynti ||
            uusiTapahtuma.lippumaara === 0
        ) {
            alert('Täytä kaikki kentät!');
            return;
        }

        try {
            const response = await fetch(
                `${url}/api/tapahtumat`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(uusiTapahtuma),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setFilteredTapahtumat((prevTapahtumat) => {
                    return [...prevTapahtumat, data];
                });

                alert('Tapahtuma lisätty');
                setTapahtumaModal(false);
                tyhjennaTapahtumaKentat();

                //Lisätään tapahtumaan ovimyynti hinta 0e
                const hinnastoData = {
                    tapahtuma: {
                        tapahtumaId: data.tapahtumaId
                    },
                    hintaluokka: 'ovimyynti',
                    hinta: 0,
                };

                try {
                    const response = await fetch(
                        `${url}/api/hinnastot`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(hinnastoData),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        // Päivitetään hinnastot-tila
                        setHinnastot((prevHinnastot) => {
                            return [...prevHinnastot, data];
                        });

                        alert('Ovimyynti hinta lisätty');
                    } else {
                        const errorData = await response.json();
                        alert('Virhe hinnaston luomisessa', errorData);
                    }
                } catch (error) {
                    alert('Virhe yhteydessä palvelimeen');
                }
            } else {
                const errorData = await response.json();
                alert(`Virhe tapahtuman lisäämisessä: ${errorData || 'Tuntematon virhe'}`);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Muokataan tapahtumaa
    const muokkaaTapahtumaa = async (uusiTapahtuma) => {

        if (
            !uusiTapahtuma.nimi ||
            !uusiTapahtuma.paikka ||
            !uusiTapahtuma.kuvaus ||
            !uusiTapahtuma.aika ||
            !uusiTapahtuma.ennakkomyynti ||
            uusiTapahtuma.lippumaara === 0
        ) {
            alert('Täytä kaikki kentät!');
            return;

        } else if (!uusiTapahtuma.id) {
            alert('jotain meni vikaan id:tä ei löytynyt');
            return;

        } else {
            // Tarkistetaan että tapahtuman aika eikä ennakkomyynti voi olla menneisyydessä
            const tapahtumaAika = new Date(uusiTapahtuma.aika);
            const ennakkomyynti = new Date(uusiTapahtuma.ennakkomyynti);

            if (tapahtumaAika < new Date()) {
                alert('Tapahtuman aika ei voi olla menneisyydessä');
                return;
            }

            if (ennakkomyynti < new Date()) {
                alert('Tapahtuman ennakkomyynti ei voi olla menneisyydessä');
                return;
            }
        }

        const { id, ...bodyarray } = uusiTapahtuma;

        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${uusiTapahtuma.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyarray),
                }
            );
            if (response.ok) {
                const data = await response.json();

                setFilteredTapahtumat((prevTapahtumat) => {
                    return prevTapahtumat.map((tapahtuma) => {
                        if (tapahtuma.tapahtumaId === data.tapahtumaId) {
                            return { ...tapahtuma, ...data };
                        }
                        return tapahtuma;
                    });
                });

                alert('Tapahtuma muokattu');
                setTapahtumaModal(false);
                tyhjennaTapahtumaKentat();
            } else {
                const errorData = await response.json();
                alert(`Virhe tapahtuman muokkaamisessa: ${errorData.message || 'Tuntematon virhe'}`);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    return {
        avaaTapahtumaModal, handleSearchChange, clearSearch, filteredTapahtumat,
        setMuokattavaTapahtuma, setTapahtumaModal, poistaTapahtuma, tyhjennaTapahtumaKentat,
        uusiTapahtuma, handleChange, muokkaaTapahtumaa, luoUusiTapahtuma, muokattavaTapahtuma, tapahtumaModal,
        searchTerm, setSearchTerm
    };

}