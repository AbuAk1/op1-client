import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lippu } from "../components/Lippu";

function Maksu() {
    const token = localStorage.getItem("token");
    const location = useLocation(); // Hook navigointidatan käyttöön
    const navigate = useNavigate(); // Hook navigointiin

    // Pääsy siirrettyyn dataan state-ominaisuudesta
    const { lisatytLiput } = location.state || {};
    const [maksutapahtuma, setMaksutapahtuma] = useState();


    const [liput, setLiput] = useState(lisatytLiput);


    const [myydytLiput, setMyydytLiput] = useState([]);

    


    const laskuta = async () => {

        // alert("Ensi luodaan maksutapahtuma");
        //  const maksutapahtuma = await luoUusiMaksutapahtuma();

        console.log("tässä piätisi olla uuden maksutapahtuman id" + JSON.stringify(maksutapahtuma));

        // console.log(maksutapahtuma)
        // console.log(lisatytLiput)

        if (maksutapahtuma) {

        for (let i = 0; i < liput.length; i++) {
            liput[i]["maksutapahtuma.maksutapahtumaId"] = maksutapahtuma;
        }
        


        console.log(liput)

        const muokatutLiput = liput.map(lippu => ({
            tapahtuma: {
                tapahtumaId: parseInt(lippu["tapahtuma.tapahtumaId"])
            },
            hinnasto: {
                hinnastoid: parseInt(lippu["hinnasto.hinnastoid"])
            },
            maksutapahtuma: {
                maksutapahtumaId: parseInt(lippu["maksutapahtuma.maksutapahtumaId"])
            }
        }));

        //   console.log(muokatutLiput);


        for (let i = 0; i < muokatutLiput.length; i++) {
            console.log("toimmiiko" + muokatutLiput[i])
            console.log("toimmiiko" + JSON.stringify(muokatutLiput[i]))

            try {
                const response = await fetch(
                    `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput`,
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

                    // console.log(myydytLiput)
                    console.log(data)

                } else {
                    console.error("Virhe lipun haussa");

                }
            } catch (error) {
                
                console.error("Virhe pyynnön aikana:", error);

            }
        }
    }

    }


    // console.log(myydytLiput[0])

    // console.log(maksutapahtuma)

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
                setMaksutapahtuma(data["maksutapahtumaId"]);
                console.log(data)
            } else {
                console.error("Virhe maksutapahtuman luonnissa");
                // setMaksutapahtuma(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            // setMaksutapahtuma(null);
        }

    }


    return (
        <div>

            <h1>Maksu</h1>

            <button onClick={() => navigate(-1)}>Takaisin</button>


            {liput && liput.length > 0 ? (
                <div>
                    <h2>Lisätyt liput</h2>
                    <ul>
                        {liput.map((lippu, index) => (
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


            <button onClick={luoUusiMaksutapahtuma}>Aloita Maksutapahtuma</button>
            <button onClick={laskuta}>Laskuta ja tulosta liput</button>

            {myydytLiput.length > 0 ? (
                <div>
                    <p>lippuja myyty </p>

                    {/* <LiputList myydytLiput={myydytLiput} /> */}


                    {myydytLiput.map((lippu) => (
                        <Lippu lippu={lippu}/>
                        // <ul key={lippu.lippuId}>
                        //     LippuId: {lippu.lippuId} <br />
                        //     Tapahtuman nimi: {lippu.tapahtuma.nimi}<br />
                        //     Hintaluokka: {lippu.hinnasto.hintaluokka} <br />
                        //     Lippumäärä: {lippu.maara}<br />
                        //     Käytetty: {lippu.kaytetty.toString()} <br />
                        // </ul>
                    ))}





                </div>
            ) : <div>ei lippuja vielä myyty</div>}

        </div>
    );

}

export default Maksu;
