// import { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import { useAuth } from '../routes/AuthContext';
// import { chatService } from '../services/chatService';
// import { websocketService } from '../services/websocketService';
// import type { Conversation, ChatMessage } from '../@type/chat';
// import { Snackbar, Alert, Avatar, Box, Typography } from '@mui/material';
//
// interface ChatContextType {
//   conversations: Conversation[];
//   totalUnread: number;
//   loadConversations: () => Promise<void>;
//   updateConversation: (roomId: number, updates: Partial<Conversation>) => void;
// }
//
// const ChatContext = createContext<ChatContextType | undefined>(undefined);
//
// export const useChatContext = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChatContext must be used within ChatProvider');
//   }
//   return context;
// };
//
// export const ChatProvider = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [notification, setNotification] = useState<{
//     open: boolean;
//     message: ChatMessage | null;
//     senderName: string;
//     senderAvatar?: string;
//   }>({
//     open: false,
//     message: null,
//     senderName: '',
//   });
//
//   const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
//
//   const loadConversations = async () => {
//     if (!user?.id) return;
//
//     try {
//       const data = await chatService.getConversations(user.id);
//       setConversations(data);
//     } catch (err) {
//       console.error('Failed to load conversations:', err);
//     }
//   };
//
//   const updateConversation = (roomId: number, updates: Partial<Conversation>) => {
//     setConversations(prev =>
//       prev.map(conv =>
//         conv.roomId === roomId ? { ...conv, ...updates } : conv
//       )
//     );
//   };
//
//   const handleNewMessage = (message: ChatMessage) => {
//     if (message.senderId === user?.id) return;
//     const conversation = conversations.find(c => c.roomId === message.roomId);
//     const sender = conversation?.members?.find(m => m.id === message.senderId);
//         setNotification({
//       open: true,
//       message,
//       senderName: sender?.fullName || sender?.username || 'Unknown',
//       senderAvatar: sender?.avatar,
//     });
//     setTimeout(() => {
//       loadConversations();
//     }, 5000);
//   };
//
//   // Connect to websocket and subscribe to all rooms
//   useEffect(() => {
//     if (!user?.id || conversations.length === 0) return;
//
//     websocketService.connect(
//       () => {
//         conversations.forEach(conv => {
//           websocketService.subscribeToRoom(conv.roomId, handleNewMessage);
//         });
//       },
//       (error) => {
//         console.error('❌ WebSocket connection error:', error);
//       }
//     );
//
//     return () => {
//       conversations.forEach(conv => {
//         websocketService.unsubscribeFromRoom(conv.roomId);
//       });
//     };
//   }, [user?.id, conversations.length]);
//
//   useEffect(() => {
//     if (user?.id) {
//       loadConversations();
//     }
//   }, [user?.id]);
//
//   const handleCloseNotification = () => {
//     setNotification(prev => ({ ...prev, open: false }));
//   };
//
//   return (
//     <ChatContext.Provider
//       value={{
//         conversations,
//         totalUnread,
//         loadConversations,
//         updateConversation,
//       }}
//     >
//       {children}
//
//       {/* Toast Notification */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={5000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={handleCloseNotification}
//           severity="info"
//           sx={{ width: '100%', minWidth: 300 }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//             <Avatar
//               src={notification.senderAvatar}
//               sx={{ width: 40, height: 40 }}
//             >
//               {notification.senderName.charAt(0).toUpperCase()}
//             </Avatar>
//             <Box>
//               <Typography variant="subtitle2" fontWeight={600}>
//                 {notification.senderName}
//               </Typography>
//               <Typography variant="body2">
//                 {notification.message?.message}
//               </Typography>
//             </Box>
//           </Box>
//         </Alert>
//       </Snackbar>
//     </ChatContext.Provider>
//   );
// };
