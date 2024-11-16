import React from 'react'

function Lippu() {
    
    const tap = props;


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
    )
}

export default Lippu