import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Fade,
    Backdrop
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LoginRequiredModal = ({ open, onClose, onConfirm }: Props) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: "blur(8px)",
                        backgroundColor: "rgba(0, 180, 255, 0.15)",
                    },
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    background: "linear-gradient(160deg, #00b4ff 0%, #0090d4 60%, #006fa8 100%)",
                    boxShadow: "0 24px 60px rgba(0, 180, 255, 0.4), 0 0 0 1px rgba(255,255,255,0.15)",
                    overflow: "hidden",
                    px: 1,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: "rgba(255,255,255,0.5)",
                    },
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Box
                        sx={{
                            width: 68,
                            height: 68,
                            borderRadius: "18px",
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 12px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
                            },
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 32, color: "#fff" }} />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            fontSize: "1.3rem",
                            color: "#ffffff",
                            letterSpacing: "-0.3px",
                            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        }}
                    >
                        Sign In Required
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pb: 1 }}>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        lineHeight: 1.7,
                        fontSize: "0.92rem",
                        px: 1,
                    }}
                >
                    Please sign in to your account to continue and access this feature.
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    justifyContent: "center",
                    pb: 3.5,
                    pt: 2,
                    gap: 1.5,
                    flexDirection: "column",
                    px: 3,
                }}
            >
                <Button
                    onClick={onConfirm}
                    fullWidth
                    variant="contained"
                    sx={{
                        py: 1.4,
                        borderRadius: "12px",
                        background: "#ffffff",
                        color: "#00b4ff",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        letterSpacing: "0.2px",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            background: "#f0fbff",
                            boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                            transform: "translateY(-1px)",
                        },
                        "&:active": { transform: "translateY(0)" },
                    }}
                >
                    Sign In
                </Button>

                <Button
                    onClick={onClose}
                    fullWidth
                    variant="text"
                    sx={{
                        py: 1,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.65)",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.9)",
                        },
                    }}
                >
                    Maybe later
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginRequiredModal;