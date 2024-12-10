import { useState } from "react";

// Funktiot hinnastojen hallintaan
export function useHinnastot() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const [modalOpen, setModalOpen] = useState(false);
    const [hinnastot, setHinnastot] = useState([]);
    const [hinnastoluokka, setHinnastoLuokka] = useState('');
    const [hinta, setHinta] = useState('');
    const [tapahtuma, setTapahtuma] = useState('');

    // Haetaan hinnastot tapahtumalle
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
                setHinnastot(data);
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Poistetaan hinnasto
    const poistaHinnasto = async (hinnastoId) => {

        try {
            const response = await fetch(
                `${url}/api/hinnastot/${hinnastoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                // Poista hinnasto taulukosta
                setHinnastot(prevHinnastot =>
                    prevHinnastot.filter(item => item.hinnastoid !== hinnastoId)
                );
                alert('Hinnastoluokka poistettu');

            } else {
                alert('Et voi poistaa käytössä olevaa hinnastoa')
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Luodaan hinnasto
    const luoHinnasto = async () => {
        if (!hinnastoluokka || !hinta) {
            alert('Täytä kaikki kentät!');
            return;
        }

        const hinnastoData = {
            tapahtuma: {
                tapahtumaId: tapahtuma
            },
            hintaluokka: hinnastoluokka,
            hinta: parseFloat(hinta),
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
                    return [...prevHinnastot, data];  // Lisää uusi hinnasto edellisten perään
                });
                setHinnastoLuokka('');
                setHinta('');
                alert('Hinnasto päivitetty onnistuneesti');
            } else {
                const errorData = await response.json();
                console.error('Virhe hinnaston luomisessa:', errorData);
                alert('Virhe hinnaston luomisessa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
            alert('Virhe yhteydessä palvelimeen');
        }
    };

    // Avataan modal hinnastojen näyttämiseen ja muokkaamiseen
    const avaaHinnastoModal = async (tapahtumaId) => {

        try {
            setTapahtuma(tapahtumaId);
            setHinnastoLuokka('');
            setHinta('');
            // Haetaan hinnastot tapahtumalle
            await haeHinnastot(tapahtumaId);

            // Avaa modalin, kun hinnastot on haettu
            setModalOpen(true);
        } catch (error) {
            console.error('Virhe hinnastojen haussa', error);
        }
    };

    return {
        hinnastot, setHinnastot, poistaHinnasto, hinnastoluokka, setHinnastoLuokka, hinta,
        setHinta, luoHinnasto, modalOpen, setModalOpen, avaaHinnastoModal
    };

}