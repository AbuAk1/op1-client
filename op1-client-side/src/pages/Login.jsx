import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://ohjelmistoprojekti-1-git-develop-jigonre-ohjelmistoprojekti.2.rahtiapp.fi/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kayttajatunnus: username, salasana: password }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Kirjautuminen epäonnistui');
      }

      const data = await response.json();
      localStorage.setItem('token', data.jwt);
      console.log(data);
      console.log(data.jwt);
      alert('Kirjautuminen onnistui!');
      // navigate("/tarkistus");
      navigate("/home");
      
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Käyttäjänimi:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salasana:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
