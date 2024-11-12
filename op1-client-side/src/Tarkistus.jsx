import React from 'react'
import { useState } from 'react'


function Tarkistus() {

  const [lippunumero, setLippunumero] = useState("");

  const [lippu, setLippu] = useState(null);

  const url = "https://visio/api/tickets/"; //??
  const auth = localStorage.getItem("auth");

  const etsi = async () => {
    // console.log(lippunumero)

    try {

      const response = await fetch(`${url}${lippunumero}`, {
        method: "GET",
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setLippu(data);
      } else {
        console.error("Virhe lipun haussa");
        setLippu(null);
      }
    } catch (error) {
      console.error("Virhe pyynnön aikana:", error);
      setLippu(null);
    }
  };


  const kaytaLippu = async () => {
  
    try {
      const response = await fetch(`${url}${lippunumero}`, {
        method: "PUT",
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            "hashcode": "62742b11b766e3f6958108e57734d823",
            "ticketUsedDate": "2024-10-08T11:09:20",
            "transaction": null,
            "ticketType": null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setLippu(data);  
      } else {
        console.error("Virhe lipun haussa");
        setLippu(null); // Tyhjennä lippu, jos virhe
      }
    } catch (error) {
      console.error("Virhe pyynnön aikana:", error);
      setLippu(null);
    }
  };

  return (
    <>

      <label>Anna lippunumero
        <input type='text' name='lippunumero' onChange={e => setLippunumero(e.target.value)} /><br />
      </label>
      <input type='button' value='Etsi' onClick={etsi} />

      {lippu && <div>
        
        ticketId: {lippu.ticketId || "Ei saatavilla"} <br />
        hashcode: {lippu.hashcode || "Ei saatavilla" }<br />
        ticketUsedDate: {lippu.ticketUsedDate || "Ei saatavilla"} <br />
        transaction: {lippu.transaction || "Ei saatavilla"}<br />
        ticketType: {lippu.ticketType || "Ei saatavilla"} <br />

        <button onClick={kaytaLippu}>Merkitse käytetyksi</button>
      </div>}
    </>
  );
}

export default Tarkistus


