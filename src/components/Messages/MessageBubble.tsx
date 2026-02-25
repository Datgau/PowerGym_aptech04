// import { Box, Typography } from "@mui/material";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import type {ChatMessage} from "../../@type/chat.ts";
//
// interface MessageBubbleProps {
//   message: ChatMessage;
//   isOwn: boolean;
// }
//
// const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: isOwn ? "flex-end" : "flex-start",
//         mb: 1,
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: "70%",
//           backgroundColor: isOwn ? "primary.main" : "grey.200",
//           color: isOwn ? "white" : "text.primary",
//           borderRadius: 2,
//           px: 2,
//           py: 1,
//         }}
//       >
//         {!isOwn && (
//           <Typography
//             variant="caption"
//             sx={{
//               fontWeight: 600,
//               display: "block",
//               mb: 0.5,
//             }}
//           >
//             {message.senderUsername}
//           </Typography>
//         )}
//         <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
//           {message.message}
//         </Typography>
//         <Typography
//           variant="caption"
//           sx={{
//             opacity: 0.7,
//             display: "block",
//             mt: 0.5,
//           }}
//         >
//           {formatDistanceToNow(new Date(message.createdAt), {
//             locale: vi,
//             addSuffix: true,
//           })}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };
//
// export default MessageBubble;
