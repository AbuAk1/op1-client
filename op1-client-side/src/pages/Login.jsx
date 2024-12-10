import { Box } from '@mui/material';
import logo from '../images/ticketguru.webp';
import { useLogin } from '../hooks/useLogin';
import Kirjautumislomake from '../components/login/Kirjautumislomake';

const Login = () => {

    // Käytetään uselogin-hookkia
    const { handleLogin, username, setUsername, password, setPassword, error } = useLogin();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>

            {/* Näytetään kuva */}
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

            {/* Näytetään kirjautumislomake */}
            <Kirjautumislomake
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
            />

        </Box>
    );
};

export default Login;
