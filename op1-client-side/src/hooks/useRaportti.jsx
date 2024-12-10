import { useState, useEffect } from 'react';

// Funktiot raporttien näyttämiselle
export default function useRaportti() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState([]);
    const [valittuTapahtuma, setValittuTapahtuma] = useState(null);
    const [raporttiModal, setRaporttiModal] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Haetaan tapahtumat aina kun komponentti renderöidään
    useEffect(() => {
        haeTapahtumat();
    }, []);

    // Haetaan tapahtumat
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
            } else {
                console.error('Virhe tapahtumien haussa');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    };

    // Avataan raportin näyttävä modal
    const avaaRaporttiModal = () => {
        if (valittuTapahtuma) {
            setRaporttiModal(true);
        } else {
            alert("Valitse ensin tapahtuma!");
        }
    };

    // Suljetaan raportin näyttävä modal
    const suljeRaporttiModal = () => {
        setRaporttiModal(false);
    };

    // Haetaan data raporttiin
    const fetchRaporttiData = async () => {
        try {
            const response = await fetch(
                `${url}/api/tapahtumat/${valittuTapahtuma.tapahtumaId}/liput`,
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
                setData(data);
                setLoading(false);
            } else {
                setMessage('Ei tietoja');
            }
        } catch (error) {
            console.error('Virhe pyynnön aikana:', error);
        }
    }

    // Haetaan raporttiin data uudelleen, jos tapahtuman tiedot muuttuvat
    useEffect(() => {
        if (valittuTapahtuma && valittuTapahtuma.tapahtumaId) {
            fetchRaporttiData();
        }
    }, [valittuTapahtuma]);

    return {
        valittuTapahtuma, tapahtumat, avaaRaporttiModal, suljeRaporttiModal,
        raporttiModal, loading, data, message, setValittuTapahtuma
    };
}