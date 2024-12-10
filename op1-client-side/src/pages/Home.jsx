import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import Tarkistusbutton from '../components/home/TarkistusButton';
import MyyntiButton from '../components/home/MyyntiButton';
import HallintaButton from '../components/home/HallintaButton';


function Home() {

    // Kirjautuessa ulos poistetaan tokenissa tulleet tiedot
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        navigate(-1);
    }

    const [role, setRole] = useState([]);
    const [id, setId] = useState();

    // Tallennetaan token, rooli ja id kun sivu renderöidään
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            setRole(decoded.role);
            setId(decoded.id);
            localStorage.setItem('role', decoded.role)
            localStorage.setItem('id', decoded.id)
        }
    }, []);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };


    return (

        <>
            <Typography variant='h3' sx={{ textAlign: 'center', mb: 7 }}  >VALIKKO</Typography>

            {/* Uloskirjautuminen */}
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

                {/* Tarkistus */}
                <Tarkistusbutton navigate={navigate} />

                {/* Myynti */}
                <MyyntiButton navigate={navigate} />

                {/* Hallinta vain admin rooleille */}
                {role.includes('ADMIN') && (
                    <>
                        <HallintaButton navigate={navigate} />
                    </>
                )}
            </Box>
        </>
    )
}

export default Home