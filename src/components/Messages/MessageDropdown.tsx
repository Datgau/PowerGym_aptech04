// import { useState, useEffect } from "react";
// import {
//   IconButton,
//   Badge,
//   Menu,
//   MenuItem,
//   Avatar,
//   Typography,
//   Box,
//   Divider,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { Message as MessageIcon } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../routes/AuthContext";
// import { useChatContext } from "../../contexts/ChatContext";
//
// const MessageDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { conversations, totalUnread, loadConversations } = useChatContext();
//
//   // Reload when dropdown opens to get fresh data
//   useEffect(() => {
//     if (anchorEl && user?.id) {
//       setLoading(true);
//       loadConversations().finally(() => setLoading(false));
//     }
//   }, [anchorEl]);
//
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//
//   const handleConversationClick = (roomId: number) => {
//     navigate(`/messages?roomId=${roomId}`);
//     handleClose();
//   };
//
//   const handleViewAll = () => {
//     navigate("/messages");
//     handleClose();
//   };
//
//   return (
//     <>
//       <IconButton color="inherit" onClick={handleClick}>
//         <Badge badgeContent={totalUnread} color="error">
//           <MessageIcon />
//         </Badge>
//       </IconButton>
//
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         PaperProps={{
//           sx: {
//             width: 360,
//             maxHeight: 480,
//             mt: 1.5,
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         {/* Header */}
//         <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
//           <Typography variant="h6" fontWeight={600}>
//             Tin nhắn
//           </Typography>
//         </Box>
//
//         {/* Conversations List */}
//         {loading ? (
//           <Box sx={{ py: 4, textAlign: "center" }}>
//             <CircularProgress size={24} />
//           </Box>
//         ) : conversations.length === 0 ? (
//           <Box sx={{ py: 4, textAlign: "center" }}>
//             <Typography variant="body2" color="text.secondary">
//               Chưa có tin nhắn nào
//             </Typography>
//           </Box>
//         ) : [
//             ...conversations.slice(0, 5).map((conversation) => {
//               // Get other user info (not current user)
//               const otherUser = conversation.members?.find(m => m.id !== user?.id);
//               const displayName = conversation.isGroup
//                 ? (conversation.roomName || "Nhóm")
//                 : (otherUser?.fullName || otherUser?.username || "Unknown");
//               const avatar = conversation.isGroup ? undefined : otherUser?.avatar;
//               const isUnread = conversation.unreadCount > 0;
//
//               return (
//                 <MenuItem
//                   key={conversation.roomId}
//                   onClick={() => handleConversationClick(conversation.roomId)}
//                   sx={{
//                     py: 1.5,
//                     px: 2,
//                     backgroundColor: isUnread ? "action.hover" : "transparent",
//                     "&:hover": {
//                       backgroundColor: "action.selected",
//                     },
//                   }}
//                 >
//                   <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
//                     {/* Avatar */}
//                     <Avatar
//                       src={avatar}
//                       sx={{ width: 48, height: 48 }}
//                     >
//                       {displayName.charAt(0).toUpperCase()}
//                     </Avatar>
//
//                     {/* Content */}
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           mb: 0.5,
//                         }}
//                       >
//                         <Typography
//                           variant="subtitle2"
//                           fontWeight={isUnread ? 600 : 400}
//                           noWrap
//                         >
//                           {displayName}
//                         </Typography>
//                         {conversation.lastUpdated && (
//                           <Typography variant="caption" color="text.secondary">
//                             {formatDistanceToNow(
//                               new Date(conversation.lastUpdated),
//                               {
//                                 locale: vi,
//                                 addSuffix: false,
//                               }
//                             )}
//                           </Typography>
//                         )}
//                       </Box>
//
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Typography
//                           variant="body2"
//                           color={isUnread ? "text.primary" : "text.secondary"}
//                           fontWeight={isUnread ? 500 : 400}
//                           noWrap
//                           sx={{ flex: 1 }}
//                         >
//                           {conversation.lastMessage?.message || "Chưa có tin nhắn"}
//                         </Typography>
//                         {isUnread && (
//                           <Box
//                             sx={{
//                               minWidth: 20,
//                               height: 20,
//                               borderRadius: "50%",
//                               backgroundColor: "primary.main",
//                               color: "white",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {conversation.unreadCount}
//                           </Box>
//                         )}
//                       </Box>
//                     </Box>
//                   </Box>
//                 </MenuItem>
//               );
//             }),
//             <Divider key="divider" />,
//           ]
//         }
//         <Box key="view-all" sx={{ p: 1 }}>
//               <Button fullWidth onClick={handleViewAll}>
//                 Xem tất cả tin nhắn
//               </Button>
//         </Box>
//       </Menu>
//     </>
//   );
// };
//
// export default MessageDropdown;
