import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';

import ticketCheckImage from '../images/ticketcheck.jpg';
import myyntiImage from '../images/myyntibutton.jpg';
import hallintaImage from '../images/hallinta.jpg';


function Home() {

    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate(-1);
    }

    const [role, setRole] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');// Haetaan token localStoragesta
        if (token) {
            const decoded = parseJwt(token);
            console.log(decoded);
            setRole(decoded.role);
            localStorage.setItem('role', decoded.role)
        }
    }, []);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));  // Purkaa tokenin payload-osa
    };


    return (

        <>
            <Typography variant='h3' sx={{ textAlign: 'center', mb: 7 }}  >VALIKKO</Typography>
            <Button
                variant="contained"
                onClick={logOut}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    marginBottom: 2,
                    zIndex: 100,
                    borderRadius: '8px',
                }}
            >
                Kirjaudu ulos
            </Button>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    onClick={() => navigate("/tarkistus")}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '300px',
                        height: '350px',
                        backgroundImage: `url(${ticketCheckImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: 5,
                        '&:hover': {
                            opacity: 0.9,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Himmentää taustan
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                    >
                        Siirry Tarkistukseen
                    </Box>
                </Button>
                <Button
                    onClick={() => navigate("/myynti")}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '300px',
                        height: '350px',
                        backgroundImage: `url(${myyntiImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: 5,
                        '&:hover': {
                            opacity: 0.9,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Himmentää taustan
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                    >
                        Siirry Myyntiin
                    </Box>
                </Button>
                {role.includes('ADMIN') && (
                    <Button
                        onClick={() => navigate("/Hallinta")}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '300px',
                            height: '350px',
                            backgroundImage: `url(${hallintaImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 5,
                            '&:hover': {
                                opacity: 0.9,
                            },
                        }}
                    >

                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Himmentää taustan
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                            }}
                        >
                            Siirry Hallintaan
                        </Box>
                    </Button>
                )}
            </Box>
        </>
    )
}

export default Home