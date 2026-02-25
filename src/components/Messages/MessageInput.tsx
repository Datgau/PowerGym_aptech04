// import { useState } from "react";
// import { Box, TextField, IconButton } from "@mui/material";
// import { Send, AttachFile, EmojiEmotions } from "@mui/icons-material";
//
// interface MessageInputProps {
//   onSendMessage: (message: string) => void;
//   disabled?: boolean;
// }
//
// const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
//   const [message, setMessage] = useState("");
//
//   const handleSend = () => {
//     if (!message.trim()) return;
//     onSendMessage(message.trim());
//     setMessage("");
//   };
//
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };
//
//   return (
//     <Box sx={{ p: 2, display: "flex", gap: 1, alignItems: "center" }}>
//       <IconButton size="small" disabled={disabled}>
//         <AttachFile />
//       </IconButton>
//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Nhập tin nhắn..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyPress={handleKeyPress}
//         disabled={disabled}
//         sx={{
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 3,
//           },
//         }}
//       />
//       <IconButton size="small" disabled={disabled}>
//         <EmojiEmotions />
//       </IconButton>
//       <IconButton
//         color="primary"
//         onClick={handleSend}
//         disabled={!message.trim() || disabled}
//       >
//         <Send />
//       </IconButton>
//     </Box>
//   );
// };
//
// export default MessageInput;
