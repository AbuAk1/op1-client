import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Maksu() {
    const location = useLocation(); // Hook navigointidatan käyttöön
    const navigate = useNavigate(); // Hook navigointiin

    // Pääsy siirrettyyn dataan state-ominaisuudesta
    const { lisatytLiput } = location.state || {}; 


    const [maksutapahtuma , setMaksutapahtuma] = useState(null);

    const token = localStorage.getItem("token");


    const laskuta = async () => {

        alert("Ensi luodaan maksutapahtuma");
        luoUusiMaksutapahtuma();
        console.log(maksutapahtuma)
        alert("Sitten lisätään liippuihin maksutapahtuma");

        alert("Lippujen lisääminen");

    }


    const test = () => []

    const luoUusiMaksutapahtuma = async () => {

        try {
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/maksutapahtumat`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "kayttaja": {
                            "kayttajaId": 1
                        }
                    }

                    ),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setMaksutapahtuma(data);
                console.log(data)
            } else {
                console.error("Virhe maksutapahtuman luonnissa");
                setMaksutapahtuma(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            setMaksutapahtuma(null);
        }

    }
    

    return (
        <div>

            <h1>Maksu</h1>
            
            <button onClick={() => navigate(-1)}>Takaisin</button>


            {lisatytLiput && lisatytLiput.length > 0 ? (
                <div>
                    <h2>Lisätyt liput</h2>
                    <ul>
                        {lisatytLiput.map((lippu, index) => (
                            <li key={index}>
                                <strong>Lippu {index + 1}:</strong>{" "}
                                {Object.entries(lippu).map(([key, value]) => (
                                    <div key={key}>
                                        {key}: {value}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Ei saatavilla tietoja maksua varten.</p>
            )}
        
        <button onClick={laskuta}>Laskuta ja tulosta liput</button>

        </div>
    );
}

export default Maksu;
