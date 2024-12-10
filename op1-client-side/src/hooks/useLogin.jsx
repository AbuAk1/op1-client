import { useState, useEffect } from 'react';
import loginBg from '../images/loginbg.jpg';
import { useNavigate } from 'react-router-dom';

// Funktiot kirjautumisen käsittelyyn
export function useLogin() {

  const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Käytetään navigointia
  const navigate = useNavigate();

  // Asetetaan tyylit kun sivu renderöidään
  useEffect(() => {
    const body = document.querySelector('body');
    body.style.backgroundImage = `url(${loginBg})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.height = '100vh';
    document.getElementById('root').style.padding = '0';

    return () => {
      // Palautetaan oletustyyli poistuessa
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundPosition = '';
      body.style.height = '';
      document.getElementById('root').style.padding = '2rem';
    };
  }, []);

  // Kirjaudutaan sisään
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${url}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kayttajatunnus: username, salasana: password }),
      });

      if (!response.ok) {
        throw new Error('Kirjautuminen epäonnistui');
      }

      const data = await response.json();
      localStorage.setItem('token', data.jwt);
      alert('Kirjautuminen onnistui!');
      navigate("/home");

    } catch (err) {
      setError(err.message);
    }
  };

  return { handleLogin, username, setUsername, password, setPassword, error };
}