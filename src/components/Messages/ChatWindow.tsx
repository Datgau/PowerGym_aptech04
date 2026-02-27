// import { useEffect, useRef } from "react";
// import {
//   Box,
//   Avatar,
//   Typography,
//   IconButton,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import { MoreVert } from "@mui/icons-material";
// import MessageBubble from "./MessageBubble";
// import MessageInput from "./MessageInput";
// import type {ChatMessage, Conversation} from "../../@type/chat.ts";
//
// interface ChatWindowProps {
//   conversation: Conversation;
//   messages: ChatMessage[];
//   currentUserId: number;
//   onSendMessage: (message: string) => void;
//   loading?: boolean;
// }
//
// const ChatWindow = ({
//   conversation,
//   messages,
//   currentUserId,
//   onSendMessage,
//   loading,
// }: ChatWindowProps) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//
//   const getConversationName = () => {
//     if (conversation.isGroup) {
//       return conversation.roomName || "Nhóm";
//     }
//     const otherUser = conversation.members?.find(m => m.id !== currentUserId);
//     return otherUser?.fullName || otherUser?.username || "Unknown";
//   };
//
//   const getConversationAvatar = () => {
//     if (conversation.isGroup) {
//       return undefined;
//     }
//     const otherUser = conversation.members?.find(m => m.id !== currentUserId);
//     return otherUser?.avatar;
//   };
//
//   const getAvatarContent = () => {
//     const avatar = getConversationAvatar();
//     const name = getConversationName();
//
//     if (avatar) {
//       return <Avatar src={avatar} alt={name} />;
//     }
//     return <Avatar>{name.charAt(0).toUpperCase()}</Avatar>;
//   };
//
//   return (
//     <Box
//       sx={{
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//       }}
//     >
//       {/* Chat Header */}
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: 1,
//           borderColor: "divider",
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//         }}
//       >
//         {getAvatarContent()}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle1" fontWeight={600}>
//             {getConversationName()}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {conversation.isGroup
//               ? `${conversation.memberIds.length} members`
//               : conversation.members?.find(m => m.id !== currentUserId)?.username || 'User'
//             }
//           </Typography>
//         </Box>
//         <IconButton>
//           <MoreVert />
//         </IconButton>
//       </Box>
//
//       {/* Messages */}
//       <Box
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           p: 2,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//             <CircularProgress />
//           </Box>
//         ) : messages.length === 0 ? (
//           <Box sx={{ textAlign: "center", p: 3 }}>
//             <Typography color="text.secondary">
//               No messages yet. Start the conversation!
//             </Typography>
//           </Box>
//         ) : (
//           <>
//             {messages.map((message) => (
//               <MessageBubble
//                 key={message.id}
//                 message={message}
//                 isOwn={message.senderId === currentUserId}
//               />
//             ))}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </Box>
//
//       <Divider />
//
//       {/* Message Input */}
//       <MessageInput onSendMessage={onSendMessage} disabled={loading} />
//     </Box>
//   );
// };
//
// export default ChatWindow;
