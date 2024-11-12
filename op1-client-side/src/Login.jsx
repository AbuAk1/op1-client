import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const url = "https://postman-echo.com/basic-auth"; //??

  
  // const cred = btoa(`${username}:${password}`);
  const cred= "cG9zdG1hbjpwYXNzd29yZA==";
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log(username);
    try {
      const response = await fetch(url, {
        // method: 'POST',
        method: 'GET', //postmanissa auth testaukseen
        headers: {
          'Authorization': `Basic ${cred}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.log(response);
        // console.log(cred)
        throw new Error('Kirjautuminen epäonnistui');
      }
      
      if (response.ok){
      sessionStorage.setItem('auth', `Basic ${cred}`);
      
      alert('Kirjautuminen onnistui!');
      navigate("/tarkistus");
    }
      
    } catch (err) {
      setError(err.message);
      // console.log(cred)
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
