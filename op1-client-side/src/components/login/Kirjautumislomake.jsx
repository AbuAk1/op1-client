import { TextField, Button, Typography, Box, Alert } from '@mui/material';

export default function Kirjautumislomake({ handleLogin, username, setUsername, password, setPassword, error }) {

    return (
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
    )
}