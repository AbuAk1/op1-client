import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Myynti() {
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null); // Dropdown-tila
    const [hinnastot, setHinnastot] = useState([]);

    const [lisatytLiput, setLisatytLiput] = useState([]);




    //haetapahtumat
    const haeTapahtumat = async () => {
        try {
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTapahtumat(data);
                // console.log(data)
            } else {
                console.error("Virhe lipun haussa");
                setTapahtumat(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            setTapahtumat(null);
        }
    };

    //dropdown
    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };


    const [formData, setFormData] = useState({
        tapahtuma: { tapahtumaId: '' },
        hinnasto: { hinnastoid: '' },
        maksutapahtuma: { maksutapahtumaId: '' }
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        const formData = new FormData(e.target); // K
        const json = Object.fromEntries(formData.entries()); // Muutetaan JSON-muotoon.

        console.log(json)


        // Lisää uusi JSON-objekti lippulistaan
        setLisatytLiput((prevLippulista) => [...prevLippulista, json]);

    };


    const haeHinnastot = async (tapahtuma_id) => {
        try {
            const response = await fetch(
                `https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/tapahtumat/${tapahtuma_id}/hinnastot`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setHinnastot(data);
                // console.log(data)
            } else {
                console.error("Virhe lipun haussa");
                setHinnastot(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            setHinnastot(null);
        }
    };

    const navigate = useNavigate();

    const siirryMaksuun = () => {

        console.log(lisatytLiput)

        navigate("/maksu", { state: { lisatytLiput } });
    }


    return (
        <>
            <button onClick={haeTapahtumat}>Hae tapahtumat</button>
            {tapahtumat && (
                <div className="event-list">
                    {tapahtumat.map((tap, index) => (
                        <div key={index} className="event-box">
                            <div className="event-details">
                                <p>
                                    <strong>Tapahtuma:</strong> {tap.nimi}<br />
                                    <strong>Ajankohta:</strong> {tap.aika}<br />
                                    <strong>Paikka:</strong> {tap.paikka}<br />
                                    <strong>Kuvaus:</strong> {tap.kuvaus}<br />
                                    <strong>Ennakkomyynti päättyy:</strong> {tap.ennakkomyynti}
                                </p>
                            </div>
                            <div className="event-action">
                                <button onClick={() => toggleDropdown(index)}>Myy lippuja</button>
                                {openDropdown === index && (

                                    <div className="dropdown">
                                        <p>Myyntinäkymä tulossa...</p>
                                        <form onSubmit={handleSubmit}>
                                            <div style={{ display: 'none' }}>
                                                <label>Tapahtuma ID:</label>
                                                <input
                                                    type="number"
                                                    name="tapahtuma.tapahtumaId"
                                                    value={tap.tapahtumaId}  // Käytetään vain tap.tapahtumaId arvoa
                                                    onChange={(e) => handleChange(e)}  // Jos haluat päivittää formDataa, mutta et kenttää
                                                />
                                            </div>
                                            <div>
                                                <label>Hintaluokka:</label>
                                                <select
                                                    name="hinnasto.hinnastoid"
                                                    value={formData.hinnasto.hinnastoid}
                                                    onChange={(e) => handleChange(e)}
                                                    onClick={() => haeHinnastot(tap.tapahtumaId)} // Hakee hinnastot
                                                >
                                                    <option value="" disabled>Valitse hintaluokka</option>
                                                    {hinnastot &&
                                                        hinnastot.map((hinnasto) => (
                                                            <option key={hinnasto.hinnastoid} value={hinnasto.hinnastoid}>
                                                                {hinnasto.hintaluokka} {hinnasto.hinta} €
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <div style={{ display: 'none' }}>
                                                <label>Maksutapahtuma ID:</label>
                                                <input
                                                    
                                                    type="number"
                                                    name="maksutapahtuma.maksutapahtumaId"
                                                    value={formData.maksutapahtuma.maksutapahtumaId}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {/* <button type="button" onClick={lisaaLippu}>Lisää lippu</button> */}

                                            <button type="submit">Lisää lippu</button>


                                         

                                            
                                        </form>
                                        <h3>Lisätyt tiedot:</h3>
                                            <ul>
                                                {lisatytLiput.map((lippu, index) => (
                                                    <li key={index}>
                                                        Lippu: TapahtumaID: {lippu['tapahtuma.tapahtumaId'] || "Ei tapahtumaId"} ,
                                                        Hinnastoid: {lippu['hinnasto.hinnastoid'] || "Ei hinnastoid"},
                                                        {/* Maksutapahtumaid: {lippu['tapahtuma.maksutapahtumaId'] || "Ei maksutapahtumaID"} */}
                                                    </li>
                                                ))}
                                            </ul>
                                        <button type='button' onClick={siirryMaksuun}>Siirry Maksuun</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Myynti;
