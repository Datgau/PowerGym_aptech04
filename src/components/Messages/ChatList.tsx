// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Typography,
//   Badge,
//   CircularProgress,
// } from "@mui/material";
// import { Circle } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import type {Conversation} from "../../@type/chat.ts";
//
// interface ChatListProps {
//   conversations: Conversation[];
//   selectedRoomId: number | null;
//   onSelectConversation: (conversation: Conversation) => void;
//   loading?: boolean;
//   currentUserId: number;
// }
//
// const ChatList = ({
//   conversations,
//   selectedRoomId,
//   onSelectConversation,
//   loading,
//   currentUserId,
// }: ChatListProps) => {
//   const getConversationName = (conversation: Conversation) => {
//     if (conversation.isGroup) {
//       return conversation.roomName || "Group";
//     }
//     // For 1-1 chat, show other user's name
//     const otherUser = conversation.members?.find(m => m.id !== currentUserId);
//     return otherUser?.fullName || otherUser?.username || "Unknown";
//   };
//
//   const getConversationAvatar = (conversation: Conversation) => {
//     if (conversation.isGroup) {
//       return undefined;
//     }
//     const otherUser = conversation.members?.find(m => m.id !== currentUserId);
//     return otherUser?.avatar;
//   };
//
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }
//
//   if (conversations.length === 0) {
//     return (
//       <Box sx={{ p: 3, textAlign: "center" }}>
//         <Typography color="text.secondary">
//           No conversations yet
//         </Typography>
//       </Box>
//     );
//   }
//
//   return (
//     <List sx={{ overflow: "auto", flex: 1 }}>
//       {conversations.map((conversation) => {
//         const isSelected = selectedRoomId === conversation.roomId;
//         const isUnread = conversation.unreadCount > 0;
//
//         return (
//           <ListItem
//             key={conversation.roomId}
//             disablePadding
//             sx={{
//               backgroundColor: isUnread && !isSelected ? "action.hover" : undefined,
//             }}
//           >
//             <ListItemButton
//               selected={isSelected}
//               onClick={() => onSelectConversation(conversation)}
//             >
//               <ListItemAvatar>
//               <Badge
//                 overlap="circular"
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                 badgeContent={
//                   <Circle
//                     sx={{
//                       width: 12,
//                       height: 12,
//                       color: "success.main",
//                       border: "2px solid white",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 }
//               >
//                 <Avatar src={getConversationAvatar(conversation)}>
//                   {getConversationName(conversation).charAt(0)}
//                 </Avatar>
//               </Badge>
//             </ListItemAvatar>
//             <ListItemText
//               primary={
//                 <Typography
//                   variant="subtitle2"
//                   fontWeight={isUnread ? 600 : 400}
//                 >
//                   {getConversationName(conversation)}
//                 </Typography>
//               }
//               secondary={
//                 conversation.lastMessage ? (
//                   <Typography
//                     variant="body2"
//                     color={isUnread ? "text.primary" : "text.secondary"}
//                     fontWeight={isUnread ? 500 : 400}
//                     noWrap
//                   >
//                     {conversation.lastMessage.message}
//                   </Typography>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     No messages yet
//                   </Typography>
//                 )
//               }
//             />
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
//               {conversation.lastUpdated && (
//                 <Typography variant="caption" color="text.secondary">
//                   {formatDistanceToNow(new Date(conversation.lastUpdated), {
//                     locale: vi,
//                     addSuffix: false,
//                   })}
//                 </Typography>
//               )}
//               {isUnread && (
//                 <Box
//                   sx={{
//                     minWidth: 20,
//                     height: 20,
//                     borderRadius: "50%",
//                     backgroundColor: "primary.main",
//                     color: "white",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "0.75rem",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {conversation.unreadCount}
//                 </Box>
//               )}
//             </Box>
//             </ListItemButton>
//           </ListItem>
//         );
//       })}
//     </List>
//   );
// };
//
// export default ChatList;
