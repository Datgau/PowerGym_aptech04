// import { useState } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Typography,
//   Tabs,
//   Tab,
//   IconButton,
// } from "@mui/material";
// import {
//   FavoriteBorder,
//   ChatBubbleOutline,
//   PersonAdd,
//   AlternateEmail,
//   Info,
//   MoreVert,
// } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useNavigate } from "react-router-dom";
// import Header from "../../components/Home/Header";
// import { mockNotifications } from "../../data/mockNotifications";
// import type { Notification } from "../../@type/notification";
//
// const Notifications = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const navigate = useNavigate();
//
//   // TODO: Replace with API call
//   // const { data: notifications } = useQuery('/api/notifications');
//   const [notifications] = useState(mockNotifications);
//
//   const filteredNotifications =
//     tabValue === 0
//       ? notifications
//       : tabValue === 1
//       ? notifications.filter((n) => !n.read)
//       : notifications.filter((n) => n.type === "mention");
//
//   const handleNotificationClick = (notification: Notification) => {
//     // TODO: Mark as read via API
//     // await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' });
//
//     if (notification.postId) {
//       navigate(`/post/${notification.postId}`);
//     } else if (notification.type === "follow" && notification.user) {
//       navigate(`/profile/${notification.user.username}`);
//     }
//   };
//
//   const getNotificationIcon = (type: Notification["type"]) => {
//     switch (type) {
//       case "like":
//         return <FavoriteBorder sx={{ color: "error.main" }} />;
//       case "comment":
//         return <ChatBubbleOutline sx={{ color: "primary.main" }} />;
//       case "follow":
//         return <PersonAdd sx={{ color: "success.main" }} />;
//       case "mention":
//         return <AlternateEmail sx={{ color: "warning.main" }} />;
//       case "system":
//         return <Info sx={{ color: "info.main" }} />;
//       default:
//         return <Info />;
//     }
//   };
//
//   return (
//     <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
//       <Header />
//
//       <Container maxWidth="md" sx={{ py: 3 }}>
//         <Paper>
//           {/* Header */}
//           <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
//             <Typography variant="h5" fontWeight={600}>
//               Thông báo
//             </Typography>
//           </Box>
//
//           {/* Tabs */}
//           <Tabs
//             value={tabValue}
//             onChange={(_, newValue) => setTabValue(newValue)}
//             sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
//           >
//             <Tab label="Tất cả" />
//             <Tab label="Chưa đọc" />
//             <Tab label="Nhắc đến" />
//           </Tabs>
//
//           {/* Notifications List */}
//           <List>
//             {filteredNotifications.length === 0 ? (
//               <Box sx={{ py: 8, textAlign: "center" }}>
//                 <Typography variant="body1" color="text.secondary">
//                   Không có thông báo nào
//                 </Typography>
//               </Box>
//             ) : (
//               filteredNotifications.map((notification) => (
//                 <ListItem
//                   key={notification.id}
//                   button
//                   onClick={() => handleNotificationClick(notification)}
//                   sx={{
//                     backgroundColor: notification.read
//                       ? "transparent"
//                       : "action.hover",
//                     "&:hover": {
//                       backgroundColor: "action.selected",
//                     },
//                   }}
//                   secondaryAction={
//                     <IconButton edge="end">
//                       <MoreVert />
//                     </IconButton>
//                   }
//                 >
//                   <ListItemAvatar>
//                     {notification.user ? (
//                       <Avatar src={notification.user.avatar} />
//                     ) : (
//                       <Avatar sx={{ backgroundColor: "grey.100" }}>
//                         {getNotificationIcon(notification.type)}
//                       </Avatar>
//                     )}
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={
//                       <Typography variant="body1">
//                         {notification.user && (
//                           <strong>{notification.user.fullName}</strong>
//                         )}{" "}
//                         {notification.content}
//                       </Typography>
//                     }
//                     secondary={
//                       <Typography variant="caption" color="primary">
//                         {formatDistanceToNow(new Date(notification.createdAt), {
//                           addSuffix: true,
//                           locale: vi,
//                         })}
//                       </Typography>
//                     }
//                   />
//                   {!notification.read && (
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: "50%",
//                         backgroundColor: "primary.main",
//                         mr: 2,
//                       }}
//                     />
//                   )}
//                 </ListItem>
//               ))
//             )}
//           </List>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };
//
// export default Notifications;
