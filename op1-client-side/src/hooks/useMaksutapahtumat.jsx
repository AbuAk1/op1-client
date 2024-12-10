import { useState } from 'react';
import dayjs from 'dayjs';

// Funktiot maksutapahtumien käsittelyyn

export function useMaksutapahtumat() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem('token');
    const [maksutapahtumat, setMaksutapahtumat] = useState([]);
    const [liput, setLiput] = useState([]);
    const [maksutapahtumanLiput, setMaksutapahtumanLiput] = useState({});
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [maksuId, setMaksuId] = useState(null);
    const [palautusSumma, setPalautusSumma] = useState(0);
    const [haetutMaksutapahtumat, setHaetutMaksutapahtumat] = useState([]);

    // Haetaan maksutapahtumat
    const haeMaksutapahtumat = async () => {

        try {
            const response = await fetch(
                `${url}/api/maksutapahtumat`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

            if (response.ok) {
                const data = await response.json();
                const suodatetutTapahtumat = data.filter((tapahtuma) => !tapahtuma.removed).reverse();
                setMaksutapahtumat(suodatetutTapahtumat);
                setHaetutMaksutapahtumat(suodatetutTapahtumat);
                await haeLiput();
            } else {
                const errorData = await response.json();
                console.error("Virhe maksutapahtumien haussa", errorData)
                alert('Maksutapahtumia ei löytynyt.')

            }
        } catch (error) {
            console.error("Virhe maksutapahtumapyynnön aikana: ", error);
            alert('Maksutapahtumia ei voitu hakea tietokannasta.')
        }
    }

    // Suodatetaan maksutapahtumat
    const suodataMaksutapahtumat = () => {

        if (!startDate || !endDate) {
            alert("Valitse aikaväli.");
            return;
        }

        const suodatetutTapahtumat = maksutapahtumat.filter((maksu) => {
            const maksuDate = dayjs(maksu.aikaleima);
            const start = dayjs(startDate).startOf('day');
            const end = dayjs(endDate).endOf('day');

            return maksuDate.isBetween(start, end, null, '[]');
        })

        if (!suodatetutTapahtumat || suodatetutTapahtumat <= 0) {

            alert('Maksutapahtumia ei löytynyt kyseisellä aikavälillä. Näytetään kaikki maksutapahtumat.')
            haeMaksutapahtumat();
        }

        setHaetutMaksutapahtumat(suodatetutTapahtumat);
    }

    // Haetaan kaikki liput
    const haeLiput = async () => {
        try {
            const response = await fetch(
                `${url}/api/liput`,
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
                setLiput(data)
            } else {
                const errorData = await response.json();
                console.error("Virhe lippujen haussa", errorData);
                alert('Lippujen haku epäonnistui.')
            }
        } catch (error) {
            console.error("Virhe lippupyynnön aikana: ", error)
            alert('Lippuja ei voitu noutaa tietokannasta.')
        }
    };

    // Haetaan maksutapahtumien liput
    const haeMaksutapahtumanLiput = async (id) => {

        const suodatetutLiput = liput.filter((lippu) =>
            lippu.maksutapahtuma && lippu.maksutapahtuma.maksutapahtumaId === id
        );

        setMaksutapahtumanLiput((prevState) => ({
            ...prevState,
            [id]: suodatetutLiput,
        }));

        return suodatetutLiput;
    }

    // Poistetaan maksutapahtuma
    const poistaMaksutapahtuma = async () => {

        try {
            const response = await fetch(
                `${url}/api/maksutapahtumat/${maksuId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

            if (response.ok) {
                await poistaMaksutapahtumanLiput(maksuId);
                await haeMaksutapahtumat();
                setMaksutapahtumanLiput({});
            } else {
                const errorData = await response.json();
                console.error("DELETE MAKSUTAPAHTUMA Virhe maksutapahtuman poistossa", errorData)
                alert('DELETE MAKSUTAPAHTUMA  Maksutapahtumaa ei voitu poistaa.')
            }
        } catch (error) {
            console.error("DELETE MAKSUTAPAHTUMA  Virhe maksutapahtuman poistopyynnön aikana:", error);
            alert('DELETE MAKSUTAPAHTUMA  Maksutapahtumaa ei voitu poistaa.')
        }

        setDialogOpen(false);

    }

    // Poistetaan maksutapahtuman liput
    const poistaMaksutapahtumanLiput = async (id) => {

        let poistettavatLiput = await haeMaksutapahtumanLiput(id);

        for (let i = 0; i < poistettavatLiput.length; i++) {

            try {
                const response = await fetch(
                    `${url}/api/liput/softdelete/${poistettavatLiput[i].lippuId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                if (response.ok) {
                } else {
                    alert('Lipun palauttamisessa virhe');
                }
            } catch (error) {
                console.error("Virhe lipun palautuksessa: ", error);
            }
        }

    }

    // Avataan dialog
    const avaaDialog = (maksutaphtumaId, summa) => {
        setMaksuId(maksutaphtumaId);
        setPalautusSumma(summa);
        setDialogOpen(true);
    }

    // Suljetaan dialog
    const suljeDialog = () => setDialogOpen(false)

    // Tyhjennetään maksutapahtumat
    const tyhjennaMaksutapahtumat = () => setMaksutapahtumat([]);

    // Palautetaan halutut funktiot ja muuttujat
    return {
        suodataMaksutapahtumat, haeMaksutapahtumat, haetutMaksutapahtumat,
        maksutapahtumanLiput, palautusSumma, avaaDialog, suljeDialog, poistaMaksutapahtuma,
        dialogOpen, maksutapahtumat, setStartDate, setEndDate, tyhjennaMaksutapahtumat, startDate, endDate, haeMaksutapahtumanLiput
    };

}