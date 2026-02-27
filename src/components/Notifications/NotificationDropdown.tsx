// import { useState } from "react";
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
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   FavoriteBorder,
//   ChatBubbleOutline,
//   PersonAdd,
//   AlternateEmail,
//   Info,
// } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useNavigate } from "react-router-dom";
// import { mockNotifications } from "../../data/mockNotifications";
// import type { Notification } from "../../@type/notification";
//
// const NotificationDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const navigate = useNavigate();
//
//   // TODO: Replace with API call
//   // const { data: notifications } = useQuery('/api/notifications');
//   const notifications = mockNotifications;
//
//   const unreadCount = notifications.filter((n) => !n.read).length;
//
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
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
//     handleClose();
//   };
//
//   const handleViewAll = () => {
//     navigate("/notifications");
//     handleClose();
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
//         return <NotificationsIcon />;
//     }
//   };
//
//   return (
//     <>
//       <IconButton color="inherit" onClick={handleClick}>
//         <Badge badgeContent={unreadCount} color="error">
//           <NotificationsIcon />
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
//             Notifications
//           </Typography>
//         </Box>
//
//         {/* Notifications List */}
//         {notifications.length === 0 ? (
//           <Box sx={{ py: 4, textAlign: "center" }}>
//             <Typography variant="body2" color="text.secondary">
//               No notifications yet
//             </Typography>
//           </Box>
//         ) : [
//             ...notifications.slice(0, 5).map((notification) => (
//               <MenuItem
//                 key={notification.id}
//                 onClick={() => handleNotificationClick(notification)}
//                 sx={{
//                   py: 1.5,
//                   px: 2,
//                   backgroundColor: notification.read ? "transparent" : "action.hover",
//                   "&:hover": {
//                     backgroundColor: "action.selected",
//                   },
//                 }}
//               >
//                 <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
//                   {/* Avatar or Icon */}
//                   {notification.user ? (
//                     <Avatar
//                       src={notification.user.avatar}
//                       sx={{ width: 40, height: 40 }}
//                     />
//                   ) : (
//                     <Box
//                       sx={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         backgroundColor: "grey.100",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {getNotificationIcon(notification.type)}
//                     </Box>
//                   )}
//
//                   {/* Content */}
//                   <Box sx={{ flex: 1, minWidth: 0 }}>
//                     <Typography variant="body2" sx={{ mb: 0.5 }}>
//                       {notification.user && (
//                         <strong>{notification.user.fullName}</strong>
//                       )}{" "}
//                       {notification.content}
//                     </Typography>
//                     <Typography variant="caption" color="primary">
//                       {formatDistanceToNow(new Date(notification.createdAt), {
//                         addSuffix: true,
//                         locale: vi,
//                       })}
//                     </Typography>
//                   </Box>
//
//                   {/* Unread indicator */}
//                   {!notification.read && (
//                     <Box
//                       sx={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: "50%",
//                         backgroundColor: "primary.main",
//                         mt: 1,
//                       }}
//                     />
//                   )}
//                 </Box>
//               </MenuItem>
//             )),
//             <Divider key="divider" />,
//             <Box key="view-all" sx={{ p: 1 }}>
//               <Button fullWidth onClick={handleViewAll}>
//                 View all notifications
//               </Button>
//             </Box>
//           ]
//         }
//       </Menu>
//     </>
//   );
// };
//
// export default NotificationDropdown;
