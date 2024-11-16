import React from 'react'
import { useState } from 'react'


function Tarkistus() {

    const [lippunumero, setLippunumero] = useState("");

    const [lippuId, setLippuId] =  useState("");

    const [lippu , setLippu] = useState(null);
  
    const etsi = async () => {
      console.log(lippunumero)
      
      const token = localStorage.getItem("token");

      try {

        // console.log(token);

        const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/koodi/${lippunumero}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
            console.log(data)
          setLippu(data);  
          setLippuId(data.lippuId);
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
        console.log(lippunumero)
        const token = localStorage.getItem("token");
        try {
          // console.log(token);
          console.log(lippuId);

          const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/${lippuId}`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`, 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "kaytetty": true,}),
          });
  
          if (response.ok) {
            const data = await response.json();
              console.log(data)
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


      
    const eikaytaLippu = async () => {
      console.log(lippunumero)
      
      const token = localStorage.getItem("token");

      try {
        // console.log(token);
        console.log(lippuId);

        const response = await fetch(`https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/liput/${lippuId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "kaytetty": false,}),
        });

        if (response.ok) {
          const data = await response.json();
            console.log(data)
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

  return (
    <>

        <label>Anna lippunumero
          <input type='text' name='lippunumero'  onChange={e => setLippunumero(e.target.value)}/><br />
        </label>
        <input type='button' value='Etsi' onClick={etsi} />

      {lippu && <div>
        LippuId: {lippu.lippuId} <br />
        Tapahtuman nimi: {lippu.tapahtuma.nimi}<br />
        Hintaluokka: {lippu.hinnasto.hintaluokka} <br />
        Lippumäärä: {lippu.maara}<br />
        Käytetty: {lippu.kaytetty.toString()} <br/>
        <button onClick={kaytaLippu}>Merkitse käytetyksi</button>
        <button onClick={eikaytaLippu}>ei käytä</button>
        </div>}
    </>
  );
}

export default Tarkistus


