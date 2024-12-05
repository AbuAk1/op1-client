import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import loginBg from '../images/loginbg.jpg';
import logo from '../images/ticketguru.webp';

const Login = () => {
  const url = "https://ticketguru-backend-main-ohjelmistoprojekti.2.rahtiapp.fi";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      // navigate("/tarkistus");
      navigate("/home");
      
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          {/* Left Box for Image */}
          <Box
              sx={{
                  width: '50%',
                  maxWidth: '300px',
                  height: 300,
                  borderRadius: '10px 0 0 10px', 
                  marginRight: 0,
                  overflow: 'hidden',
              }}
          >
              <img
                  src={logo}
                  alt="Example"
                  style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                  }}
              />
          </Box>

          {/* Right Box for Login Form */}
          <Box
              sx={{
                  width: '50%',
                  maxWidth: '300px',
                  padding: 4,
                  boxShadow: 3,
                  borderRadius: '0 10px 10px 0', 
                  backgroundColor: '#f9f9f9',
              }}
          >
              <Typography variant="h6" component="h2" align="center" gutterBottom>
                  Kirjaudu sisään
              </Typography>
              <form onSubmit={handleLogin}>
                  <Box mb={2}>
                      <TextField
                          fullWidth
                          label="Käyttäjänimi"
                          variant="outlined"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                  </Box>
                  <Box mb={2}>
                      <TextField
                          fullWidth
                          label="Salasana"
                          type="password"
                          variant="outlined"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                  </Box>
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ marginTop: 2 }}
                  >
                      Kirjaudu
                  </Button>
              </form>
              {error && (
                  <Box mt={2}>
                      <Alert severity="error">{error}</Alert>
                  </Box>
              )}
          </Box>
      </Box>
  );
};

export default Login;
