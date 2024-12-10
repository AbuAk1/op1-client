import { useState, useEffect } from 'react';
import jsQR from "jsqr";

// Funktiot lippujen tarkistukselle
export function useTarkistus() {

    const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
    const token = localStorage.getItem("token");
    const [lippunumero, setLippunumero] = useState("");
    const [lippuId, setLippuId] = useState("");
    const [lippu, setLippu] = useState(null);
    const [error, setError] = useState('');

    // Päivitetään haku automaattisesti, mikäli lippunumero muuttuu
    useEffect(() => {
        if (lippunumero) {
            etsi();
        }
    }, [lippunumero]);

    // Etsitään lippu annetulla lippunumerolla
    const etsi = async () => {
        if (!lippunumero) {
            return;
        }
        try {
            const response = await fetch(`${url}/api/liput/koodi/${lippunumero}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLippu(data);
                setLippuId(data.lippuId);
                setError('');
            } else {
                if (response.status == 410) {
                    console.error("Lippu on palautettu tai poistettu");
                    setLippu(null);
                    setError('Lippu on palautettu tai poistettu. Lippua ei voi merkitä käytetyksi.');
                } else {
                    setLippu(null);
                    setError('Lippua ei löytynyt, tarkista lippunumero.');
                }
            }
        } catch (error) {
            console.error("Virhe haussa: ", error);
            setLippu(null);
            setError('Virhe lipun haussa')
        }
    };

    // Luetaan QR-tiedosto lipusta
    const lueQRTiedosto = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Valitse tiedosto!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    // QR-koodista luettu data
                    setLippunumero(code.data);
                    etsi();
                } else {
                    alert("QR-koodia ei löytynyt. Varmista, että kuva sisältää selkeän QR-koodin.");
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Merkitään lippu käytetyksi
    const kaytaLippu = async () => {
        try {
            const response = await fetch(`${url}/api/liput/${lippuId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "kaytetty": true, }),
            });

            if (response.ok) {
                const data = await response.json();
                setLippu(data);
                alert('Lippu asetettu käytetyksi')
            } else {
                console.error("Virhe lipun haussa");
                setLippu(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            setLippu(null);
        }
    };

    // Merkitään lippu käyttämättömäksi
    const peruutaKaytto = async () => {
        try {
            const response = await fetch(`${url}/api/liput/${lippuId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "kaytetty": false, }),
            });

            if (response.ok) {
                const data = await response.json();
                setLippu(data);
            } else {
                console.error("Virhe lipun haussa");
                setError('virhe');
                setLippu(null);
            }
        } catch (error) {
            console.error("Virhe pyynnön aikana:", error);
            setLippu(null);
        }
    };

    return { lippunumero, setLippunumero, lueQRTiedosto, lippu, kaytaLippu, peruutaKaytto, error };

}