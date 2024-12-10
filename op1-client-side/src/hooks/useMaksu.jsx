import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Funktiot maksutapahtuman suorittamiseen
export function useMaksu() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const kayttajaId = localStorage.getItem("id");
    const location = useLocation(); // Hook navigointidatan käyttöön
    const navigate = useNavigate(); // Hook navigointiin

    // Pääsy siirrettyyn dataan state-ominaisuudesta
    const { lisatytLiput } = location.state || {};
    const [maksutapahtuma, setMaksutapahtuma] = useState();
    const [paymentCreated, setPaymentCreated] = useState(false);
    const [liput, setLiput] = useState(lisatytLiput);

    // Alustetaan ostoksen yhteishinta 0€, ja lisätään hintaan lippujen hinta
    let yhteishinta = 0;

    liput.forEach(lippu => {
        yhteishinta += lippu.hinta;
    });

    const [myydytLiput, setMyydytLiput] = useState([]);

    // Luodaan maksutapahtuma ostettaville lipuille
    const laskuta = async () => {

        const luoUusiMaksutapahtuma = async () => {
            try {
                const response = await fetch(
                    `${url}/api/maksutapahtumat`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "kayttaja": {
                                "kayttajaId": kayttajaId
                            }
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setMaksutapahtuma(data["maksutapahtumaId"]);
                    setPaymentCreated(true);
                    return data["maksutapahtumaId"];  // Palautetaan ID, jotta tiedämme sen arvon
                } else {
                    const errorData = await response.json();
                    console.error("Virhe maksutapahtuman luonnissa:", errorData);
                    throw new Error("Maksutapahtumaa ei voitu luoda.");
                }
            } catch (error) {
                console.error("Virhe pyynnön aikana:", error);
                throw error; // Heitetään virhe edelleen eteenpäin
            }
        };

        // Luodaan maksutapahtuma ennen lipun käsittelyä ja odotetaan sen valmistumista
        let uusiMaksutapahtuma;
        try {
            uusiMaksutapahtuma = await luoUusiMaksutapahtuma();  // Odotetaan maksutapahtuman luontia
        } catch (error) {
            alert("Maksutapahtumaa ei voitu luoda");
            return;
        }

        // Varmistetaan, että maksutapahtuma on luotu
        if (!uusiMaksutapahtuma) {
            alert("Maksutapahtumaa ei luotu!");
            return;
        }

        // Muokataan liput oikealla maksutapahtuman ID:llä
        const muokatutLiput = liput.map(lippu => ({
            tapahtuma: {
                tapahtumaId: parseInt(lippu["tapahtumaId"])
            },
            hinnasto: {
                hinnastoid: parseInt(lippu["hinnastoId"])
            },
            maksutapahtuma: {
                maksutapahtumaId: parseInt(uusiMaksutapahtuma) // Käytetään luotua maksutapahtuman ID:tä
            }
        }));

        // Lähetetään muokatut liput palvelimelle
        for (let i = 0; i < muokatutLiput.length; i++) {

            try {
                const response = await fetch(
                    `${url}/api/liput`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(muokatutLiput[i]),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setMyydytLiput(prevLiput => [...prevLiput, data]);
                } else {
                    alert(response.status);
                }
            } catch (error) {
                console.error("Virhe pyynnön aikana:", error);
            }
        }
    };

    const printRef = useRef();

    // Tehdään tiedosto lipuista tulostettavassa muodossa
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML; // Vain tämä osio tulostetaan
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`
            <html>
                <head>
                    <title>Liput</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }

                        .print-container {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        .print-item {
                            border: 2px dashed #000;
                            box-sizing: border-box;
                            background-color: #fff;
                            width: 100%;
                        }

                        /* Tulostusasetukset */
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact; /* Varmistaa värin tulostuksen */
                                color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        ${printContents}
                    </div>
                </body>
            </html>
        `);
        newWindow.document.close();
        newWindow.onload = () => {
            newWindow.print();
        };
    };

    return { liput, yhteishinta, paymentCreated, laskuta, printRef, myydytLiput, handlePrint };
}