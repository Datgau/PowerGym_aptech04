// import { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Alert,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import { Add } from "@mui/icons-material";
// import Header from "../../components/Home/Header";
// import ChatList from "../../components/Messages/ChatList";
// import ChatWindow from "../../components/Messages/ChatWindow";
// import CreateChatDialog from "../../components/Messages/CreateChatDialog";
// import { chatService } from "../../services/chatService";
// import { websocketService } from "../../services/websocketService";
// import { useAuth } from "../../routes/AuthContext";
// import type {ChatMessage, Conversation} from "../../@type/chat.ts";
//
// const Messages = () => {
//   const { user } = useAuth();
//   console.log('🏠 Messages component rendered, user:', user?.username, 'id:', user?.id);
//
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//
//   const handleConversationSelect = async (conversation: Conversation) => {
//     if (selectedConversation && wsConnected) {
//       websocketService.unsubscribeFromRoom(selectedConversation.roomId);
//     }
//
//     setSelectedConversation(conversation);
//     setMessagesLoading(true);
//
//     try {
//       const msgs = await chatService.getMessages(conversation.roomId);
//       setMessages(msgs);
//       if (user?.id) {
//         await chatService.markMessagesAsRead(conversation.roomId, user.id);
//         setConversations(prev =>
//           prev.map(conv =>
//             conv.roomId === conversation.roomId
//               ? { ...conv, unreadCount: 0 }
//               : conv
//           )
//         );
//       }
//
//       if (wsConnected && websocketService.isConnected()) {
//         websocketService.subscribeToRoom(conversation.roomId, (newMessage) => {
//           setMessages((prev) => [...prev, newMessage]);
//
//         setConversations((prev) =>
//             prev.map((conv) =>
//               conv.roomId === conversation.roomId
//                 ? {
//                     ...conv,
//                     lastMessage: newMessage,
//                     lastUpdated: newMessage.createdAt,
//                   }
//                 : conv
//             )
//           );
//         });
//       } else {
//         setError("WebSocket not connected, cannot subscribe to room");
//       }
//     } catch (err) {
//       setError("Không thể tải tin nhắn");
//     } finally {
//       setMessagesLoading(false);
//     }
//   };
//
//   // Load conversations and optionally select one
//   const loadConversations = async (autoSelectRoomId?: number) => {
//     if (!user?.id) return;
//     try {
//       setLoading(true);
//       const data = await chatService.getConversations(user.id);
//       setConversations(data);
//       if (autoSelectRoomId) {
//         const conversation = data.find(c => c.roomId === autoSelectRoomId);
//         if (conversation) {
//           await handleConversationSelect(conversation);
//         } else {
//           setError("Cuộc trò chuyện không tồn tại");
//         }
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách cuộc trò chuyện");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Load conversations on mount
//   useEffect(() => {
//     loadConversations();
//   }, [user?.id]);
//
//   // Connect WebSocket immediately
//   useEffect(() => {
//     if (!user?.id) {
//       console.log('Waiting for user to connect WebSocket...');
//       return;
//     }
//     websocketService.connect(
//       () => {
//         setWsConnected(true);
//         setError(null);
//         if (selectedConversation) {
//           console.log('🔄 Re-subscribing to current room:', selectedConversation.roomId);
//           websocketService.subscribeToRoom(selectedConversation.roomId, (newMessage) => {
//             console.log('📨 Received message:', newMessage);
//             setMessages((prev) => [...prev, newMessage]);
//
//             setConversations((prev) =>
//               prev.map((conv) =>
//                 conv.roomId === selectedConversation.roomId
//                   ? {
//                       ...conv,
//                       lastMessage: newMessage,
//                       lastUpdated: newMessage.createdAt,
//                     }
//                   : conv
//               )
//             );
//           });
//         }
//       },
//       (err) => {
//         setError("Không thể kết nối WebSocket. Tin nhắn có thể bị chậm.");
//       }
//     );
//
//     return () => {
//       console.log('🔌 Disconnecting WebSocket...');
//       websocketService.disconnect();
//     };
//   }, [user?.id]);
//
//   // Handle send message
//   const handleSendMessage = async (message: string) => {
//     if (!selectedConversation || !user?.id) return;
//
//     try {
//       if (wsConnected) {
//         websocketService.sendMessage(
//           selectedConversation.roomId,
//           user.id,
//           message
//         );
//         console.log('📤 Message sent via WebSocket');
//       } else {
//         // Fallback to REST API
//         const newMessage = await chatService.sendMessage(
//           selectedConversation.roomId,
//           user.id,
//           message
//         );
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     } catch (err) {
//       console.error("Failed to send message:", err);
//       setError("Không thể gửi tin nhắn");
//     }
//   };
//
//   if (!user) {
//     return (
//       <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
//         <Header />
//         <Container maxWidth="lg" sx={{ py: 3 }}>
//           <Alert severity="warning">
//             Vui lòng đăng nhập để sử dụng tính năng chat
//           </Alert>
//         </Container>
//       </Box>
//     );
//   }
//
//   return (
//     <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
//       <Header />
//
//       <Container maxWidth="lg" sx={{ py: 3 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//             {error}
//           </Alert>
//         )}
//
//         <Paper
//           sx={{
//             height: "calc(100vh - 140px)",
//             display: "flex",
//             overflow: "hidden",
//           }}
//         >
//           {/* Conversations List */}
//           <Box
//             sx={{
//               width: { xs: "100%", md: 360 },
//               borderRight: { md: 1 },
//               borderColor: "divider",
//               display: { xs: selectedConversation ? "none" : "flex", md: "flex" },
//               flexDirection: "column",
//             }}
//           >
//             <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <Box>
//                 <Typography variant="h6" fontWeight={600}>
//                   Tin nhắn
//                 </Typography>
//                 {!wsConnected && (
//                   <Typography variant="caption" color="warning.main">
//                     Đang kết nối...
//                   </Typography>
//                 )}
//               </Box>
//               <Tooltip title="Tạo cuộc trò chuyện mới">
//                 <IconButton
//                   color="primary"
//                   onClick={() => setCreateDialogOpen(true)}
//                   size="small"
//                 >
//                   <Add />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//
//             <ChatList
//               conversations={conversations}
//               selectedRoomId={selectedConversation?.roomId || null}
//               onSelectConversation={handleConversationSelect}
//               loading={loading}
//               currentUserId={user.id}
//             />
//           </Box>
//
//           {/* Chat Area */}
//           {selectedConversation ? (
//             <ChatWindow
//               conversation={selectedConversation}
//               messages={messages}
//               currentUserId={user.id}
//               onSendMessage={handleSendMessage}
//               loading={messagesLoading}
//             />
//           ) : (
//             <Box
//               sx={{
//                 flex: 1,
//                 display: { xs: "none", md: "flex" },
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography variant="h6" color="text.secondary">
//                 Chọn một cuộc trò chuyện để bắt đầu
//               </Typography>
//             </Box>
//           )}
//         </Paper>
//
//         <CreateChatDialog
//           open={createDialogOpen}
//           onClose={() => setCreateDialogOpen(false)}
//           currentUserId={user!.id}
//           onChatCreated={(roomId, targetUser) => {
//             // Create temporary conversation object with both users
//             const newConversation: Conversation = {
//               roomId,
//               isGroup: false,
//               roomName: null,
//               memberIds: [user!.id, targetUser.id],
//               members: [
//                 {
//                   id: user!.id,
//                   username: user!.username,
//                   fullName: user!.fullName || user!.username,
//                   avatar: user!.avatar || ''
//                 },
//                 targetUser
//               ],
//               lastMessage: null,
//               lastUpdated: new Date().toISOString(),
//               unreadCount: 0
//             };
//
//             setConversations(prev => {
//               const exists = prev.find(c => c.roomId === roomId);
//               if (exists) {
//                 // If exists, select it
//                 handleConversationSelect(exists);
//                 return prev;
//               }
//               handleConversationSelect(newConversation);
//               return [newConversation, ...prev];
//             });
//           }}
//         />
//       </Container>
//     </Box>
//   );
// };
//
// export default Messages;
