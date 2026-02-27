// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";
// import { chatService } from "../../services/chatService";
// import type { UserSearchResult } from "../../@type/chat";
//
// interface CreateChatDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onChatCreated: (roomId: number, targetUser: UserSearchResult) => void;
//   currentUserId: number;
// }
//
// const CreateChatDialog = ({
//   open,
//   onClose,
//   onChatCreated,
//   currentUserId,
// }: CreateChatDialogProps) => {
//   const [users, setUsers] = useState<UserSearchResult[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const observerTarget = useRef<HTMLDivElement>(null);
//
//   // Load users
//   const loadUsers = useCallback(async (pageNum: number) => {
//     if (loading || !hasMore) return;
//
//     try {
//       setLoading(true);
//       setError(null);
//       const results = await chatService.getUsersByFollow(pageNum, 20);
//
//       if (results.length < 20) {
//         setHasMore(false);
//       }
//
//       // Filter out current user
//       const filteredResults = results.filter(u => u.id !== currentUserId);
//
//       setUsers(prev => pageNum === 0 ? filteredResults : [...prev, ...filteredResults]);
//     } catch (err) {
//       console.error("Failed to load users:", err);
//       setError("Unable to load user list");
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMore, currentUserId]);
//
//   // Load initial users when dialog opens (only if not already loaded)
//   useEffect(() => {
//     if (open && users.length === 0 && !loading) {
//       if (!currentUserId) {
//         setError('Unable to identify current user');
//         return;
//       }
//
//       setPage(0);
//       setHasMore(true);
//       setCreating(false);
//       setError(null);
//       loadUsers(0);
//     }
//   }, [open, currentUserId]);
//
//   // Infinite scroll observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           loadUsers(nextPage);
//         }
//       },
//       { threshold: 0.1 }
//     );
//
//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }
//
//     return () => {
//       if (currentTarget) {
//         observer.unobserve(currentTarget);
//       }
//     };
//   }, [hasMore, loading, page, loadUsers]);
//
//   const handleSelectUser = async (targetUser: UserSearchResult) => {
//     if (creating) return;
//
//     setCreating(true);
//     setError(null);
//
//     try {
//       const roomId = await chatService.getOrCreateOneToOne(currentUserId, targetUser.id);
//
//       // Close dialog and notify parent immediately with user info
//       onClose();
//       onChatCreated(roomId, targetUser);
//     } catch (err: any) {
//       console.error('Failed to create chat:', err?.response?.data || err.message);
//       const errorMsg = err?.response?.data?.message || "Unable to create conversation";
//       setError(errorMsg);
//       setCreating(false);
//     }
//   };
//
//
//   const handleClose = () => {
//     // Don't reset users list - keep it cached for next open
//     setError(null);
//     setCreating(false);
//     onClose();
//   };
//
//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Select person to message</DialogTitle>
//       <DialogContent>
//         <Box sx={{ pt: 2, position: "relative" }}>
//           {error && (
//             <Typography color="error" variant="body2" sx={{ mb: 2 }}>
//               {error}
//             </Typography>
//           )}
//
//           {users.length === 0 && !loading && (
//             <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
//               No users available
//             </Typography>
//           )}
//
//           <List sx={{ maxHeight: 500, overflow: "auto" }}>
//             {users.map((targetUser) => (
//               <ListItem key={targetUser.id} disablePadding>
//                 <ListItemButton
//                   onClick={() => {
//                     handleSelectUser(targetUser);
//                   }}
//                   disabled={creating}
//                   sx={{
//                     borderRadius: 1,
//                     mb: 0.5,
//                   }}
//                 >
//                   <ListItemAvatar>
//                     <Avatar src={targetUser.avatar}>
//                       {(targetUser.fullName || targetUser.username).charAt(0).toUpperCase()}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={targetUser.fullName || targetUser.username}
//                     secondary={`@${targetUser.username}`}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//             {hasMore && (
//               <Box
//                 ref={observerTarget}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   py: 2,
//                 }}
//               >
//                 <CircularProgress size={24} />
//               </Box>
//             )}
//
//             {!hasMore && users.length > 0 && (
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ display: "block", textAlign: "center", py: 2 }}
//               >
//                 All users displayed
//               </Typography>
//             )}
//           </List>
//
//           {creating && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "rgba(255, 255, 255, 0.8)",
//                 zIndex: 1,
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           )}
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} disabled={creating}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
//
// export default CreateChatDialog;
