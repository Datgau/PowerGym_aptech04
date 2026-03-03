import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
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
        >
            <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <LockOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    Sign In Required
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                >
                    You need to be signed in to access this feature.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                >
                    Sign In
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginRequiredModal;