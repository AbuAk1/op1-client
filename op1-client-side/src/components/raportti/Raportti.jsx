import { Modal, Box, Typography, Button } from "@mui/material";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

export default function Raportti({ open, onClose, data, loading, message }) {

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 1200,
                    height: 600,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h6" component="h2">
                    Raportti
                </Typography>

                {!loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexGrow: 1,
                        }}
                    >
                        <Box sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <PieChart data={data} />
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}

                        >
                            <BarChart data={data} />
                        </Box>
                    </Box>
                ) : <Typography sx={{ mt: 2 }}>
                    {message}
                </Typography>}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{ mt: 2 }}
                >
                    Sulje
                </Button>
            </Box>
        </Modal>
    );
};