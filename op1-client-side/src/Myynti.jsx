import React, { useState } from 'react';

function Myynti() {
    const token = localStorage.getItem("token");
    const [tapahtumat, setTapahtumat] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null); // Dropdown-tila

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
                console.log(data)
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
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // try {
        //     const response = await fetch('https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/maksutapahtuma', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         console.log("Lähetys onnistui!");
        //     } else {
        //         console.log("Virhe lähetyksessä");
        //     }
        // } catch (error) {
        //     console.error("Virhe:", error);
        // }
    };





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
                                            <div>
                                                <label>Tapahtuma ID:</label>
                                                <input
                                                    type="number"
                                                    name="tapahtuma.tapahtumaId"
                                                    placeholder={tap.tapahtumaId}
                                                    value={formData.tapahtuma.tapahtumaId}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Hinnasto ID:</label>
                                                <input
                                                    type="number"
                                                    name="hinnasto.hinnastoid"
                                                    value={formData.hinnasto.hinnastoid}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {/* <div>
                                                <label>Maksutapahtuma ID:</label>
                                                <input
                                                    type="number"
                                                    name="maksutapahtuma.maksutapahtumaId"
                                                    value={formData.maksutapahtuma.maksutapahtumaId}
                                                    onChange={handleChange}
                                                />
                                            </div> */}
                                            <button type="submit">Lähetä</button>
                                        </form>
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
