// import { useState } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   Divider,
//   Switch,
//   TextField,
//   Button,
//   Avatar,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import {
//   Person as PersonIcon,
//   Lock as LockIcon,
//   Notifications as NotificationsIcon,
//   Palette as PaletteIcon,
//   Language as LanguageIcon,
//   Security as SecurityIcon,
//   Help as HelpIcon,
//   Info as InfoIcon,
//   PhotoCamera as PhotoCameraIcon,
//   Save as SaveIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../../routes/AuthContext";
// import Header from "../../components/Home/Header";
//
// type SettingSection =
//   | "profile"
//   | "password"
//   | "notifications"
//   | "appearance"
//   | "language"
//   | "privacy"
//   | "help"
//   | "about";
//
// const Settings = () => {
//   const { user } = useAuth();
//   const [activeSection, setActiveSection] = useState<SettingSection>("profile");
//   const [snackbar, setSnackbar] = useState({ open: false, message: "" });
//
//   // Form states
//   const [profileData, setProfileData] = useState({
//     fullName: user?.fullName || "",
//     username: user?.username || "",
//     email: user?.email || "",
//     bio: "",
//     phone: "",
//   });
//
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//
//   const [notificationSettings, setNotificationSettings] = useState({
//     emailNotifications: true,
//     pushNotifications: true,
//     messageNotifications: true,
//     likeNotifications: false,
//     commentNotifications: true,
//   });
//
//   const handleSaveProfile = () => {
//     setSnackbar({ open: true, message: "Profile updated successfully!" });
//   };
//
//   const handleChangePassword = () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setSnackbar({ open: true, message: "Passwords do not match!" });
//       return;
//     }
//     setSnackbar({ open: true, message: "Password changed successfully!" });
//     setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//   };
//
//   const menuItems = [
//     { id: "profile", label: "Profile", icon: <PersonIcon /> },
//     { id: "password", label: "Password", icon: <LockIcon /> },
//     { id: "notifications", label: "Notifications", icon: <NotificationsIcon /> },
//     { id: "appearance", label: "Appearance", icon: <PaletteIcon /> },
//     { id: "language", label: "Language", icon: <LanguageIcon /> },
//     { id: "privacy", label: "Privacy & Security", icon: <SecurityIcon /> },
//     { id: "help", label: "Help & Support", icon: <HelpIcon /> },
//     { id: "about", label: "About", icon: <InfoIcon /> },
//   ];
//
//   const renderContent = () => {
//     switch (activeSection) {
//       case "profile":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Edit Profile
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Update your personal information
//             </Typography>
//
//             <Box sx={{ display: "flex", alignItems: "center", mb: 4, mt: 3 }}>
//               <Avatar
//                 src={user?.fullName ? `https://ui-avatars.com/api/?name=${user.fullName}&size=200` : undefined}
//                 sx={{ width: 100, height: 100, mr: 3 }}
//               />
//               <Box>
//                 <Button
//                   variant="contained"
//                   startIcon={<PhotoCameraIcon />}
//                   sx={{ mb: 1 }}
//                 >
//                   Change Photo
//                 </Button>
//                 <Typography variant="caption" display="block" color="text.secondary">
//                   JPG, PNG or GIF. Max size 2MB
//                 </Typography>
//               </Box>
//             </Box>
//
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
//                 gap: 3,
//               }}
//             >
//               <Box>
//                 <TextField
//                   fullWidth
//                   label="Full Name"
//                   value={profileData.fullName}
//                   onChange={(e) =>
//                     setProfileData({ ...profileData, fullName: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box>
//                 <TextField
//                   fullWidth
//                   label="Username"
//                   value={profileData.username}
//                   onChange={(e) =>
//                     setProfileData({ ...profileData, username: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   value={profileData.email}
//                   onChange={(e) =>
//                     setProfileData({ ...profileData, email: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box>
//                 <TextField
//                   fullWidth
//                   label="Phone"
//                   value={profileData.phone}
//                   onChange={(e) =>
//                     setProfileData({ ...profileData, phone: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
//                 <TextField
//                   fullWidth
//                   label="Bio"
//                   multiline
//                   rows={4}
//                   value={profileData.bio}
//                   onChange={(e) =>
//                     setProfileData({ ...profileData, bio: e.target.value })
//                   }
//                   placeholder="Tell us about yourself..."
//                 />
//               </Box>
//             </Box>
//
//             <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
//               <Button
//                 variant="contained"
//                 startIcon={<SaveIcon />}
//                 onClick={handleSaveProfile}
//               >
//                 Save Changes
//               </Button>
//               <Button variant="outlined">Cancel</Button>
//             </Box>
//           </Box>
//         );
//
//       case "password":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Change Password
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Ensure your account is using a strong password
//             </Typography>
//
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr",
//                 gap: 3,
//                 mt: 2,
//                 maxWidth: 600,
//               }}
//             >
//               <Box>
//                 <TextField
//                   fullWidth
//                   type="password"
//                   label="Current Password"
//                   value={passwordData.currentPassword}
//                   onChange={(e) =>
//                     setPasswordData({ ...passwordData, currentPassword: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box>
//                 <TextField
//                   fullWidth
//                   type="password"
//                   label="New Password"
//                   value={passwordData.newPassword}
//                   onChange={(e) =>
//                     setPasswordData({ ...passwordData, newPassword: e.target.value })
//                   }
//                 />
//               </Box>
//               <Box>
//                 <TextField
//                   fullWidth
//                   type="password"
//                   label="Confirm New Password"
//                   value={passwordData.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordData({ ...passwordData, confirmPassword: e.target.value })
//                   }
//                 />
//               </Box>
//             </Box>
//
//             <Box sx={{ mt: 3 }}>
//               <Button
//                 variant="contained"
//                 onClick={handleChangePassword}
//               >
//                 Update Password
//               </Button>
//             </Box>
//           </Box>
//         );
//
//       case "notifications":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Notification Settings
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Manage how you receive notifications
//             </Typography>
//
//             <List sx={{ mt: 3 }}>
//               <ListItem>
//                 <ListItemText
//                   primary="Email Notifications"
//                   secondary="Receive notifications via email"
//                 />
//                 <Switch
//                   checked={notificationSettings.emailNotifications}
//                   onChange={(e) =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       emailNotifications: e.target.checked,
//                     })
//                   }
//                 />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Push Notifications"
//                   secondary="Receive push notifications on your device"
//                 />
//                 <Switch
//                   checked={notificationSettings.pushNotifications}
//                   onChange={(e) =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       pushNotifications: e.target.checked,
//                     })
//                   }
//                 />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Message Notifications"
//                   secondary="Get notified when you receive new messages"
//                 />
//                 <Switch
//                   checked={notificationSettings.messageNotifications}
//                   onChange={(e) =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       messageNotifications: e.target.checked,
//                     })
//                   }
//                 />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Like Notifications"
//                   secondary="Get notified when someone likes your post"
//                 />
//                 <Switch
//                   checked={notificationSettings.likeNotifications}
//                   onChange={(e) =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       likeNotifications: e.target.checked,
//                     })
//                   }
//                 />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Comment Notifications"
//                   secondary="Get notified when someone comments on your post"
//                 />
//                 <Switch
//                   checked={notificationSettings.commentNotifications}
//                   onChange={(e) =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       commentNotifications: e.target.checked,
//                     })
//                   }
//                 />
//               </ListItem>
//             </List>
//           </Box>
//         );
//
//       case "appearance":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Appearance
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Customize how the app looks
//             </Typography>
//
//             <List sx={{ mt: 3 }}>
//               <ListItem>
//                 <ListItemText
//                   primary="Dark Mode"
//                   secondary="Use dark theme"
//                 />
//                 <Switch />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Compact Mode"
//                   secondary="Show more content on screen"
//                 />
//                 <Switch />
//               </ListItem>
//             </List>
//           </Box>
//         );
//
//       case "language":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Language
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Choose your preferred language
//             </Typography>
//
//             <List sx={{ mt: 3 }}>
//               <ListItemButton selected>
//                 <ListItemText primary="English" secondary="English (US)" />
//               </ListItemButton>
//               <ListItemButton>
//                 <ListItemText primary="Tiếng Việt" secondary="Vietnamese" />
//               </ListItemButton>
//               <ListItemButton>
//                 <ListItemText primary="日本語" secondary="Japanese" />
//               </ListItemButton>
//             </List>
//           </Box>
//         );
//
//       case "privacy":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Privacy & Security
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Manage your privacy and security settings
//             </Typography>
//
//             <List sx={{ mt: 3 }}>
//               <ListItem>
//                 <ListItemText
//                   primary="Private Account"
//                   secondary="Only approved followers can see your posts"
//                 />
//                 <Switch />
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Two-Factor Authentication"
//                   secondary="Add an extra layer of security"
//                 />
//                 <Button size="small">Enable</Button>
//               </ListItem>
//               <Divider />
//               <ListItem>
//                 <ListItemText
//                   primary="Activity Status"
//                   secondary="Show when you're active"
//                 />
//                 <Switch defaultChecked />
//               </ListItem>
//             </List>
//           </Box>
//         );
//
//       case "help":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Help & Support
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Get help and support
//             </Typography>
//
//             <List sx={{ mt: 3 }}>
//               <ListItemButton>
//                 <ListItemText primary="Help Center" secondary="Find answers to common questions" />
//               </ListItemButton>
//               <Divider />
//               <ListItemButton>
//                 <ListItemText primary="Contact Support" secondary="Get in touch with our team" />
//               </ListItemButton>
//               <Divider />
//               <ListItemButton>
//                 <ListItemText primary="Report a Problem" secondary="Let us know if something isn't working" />
//               </ListItemButton>
//             </List>
//           </Box>
//         );
//
//       case "about":
//         return (
//           <Box>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               About
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Information about the application
//             </Typography>
//
//             <Box sx={{ mt: 3 }}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Version:</strong> 1.0.0
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Build:</strong> 2024.01.15
//               </Typography>
//               <Typography variant="body1" gutterBottom sx={{ mt: 3 }}>
//                 © 2024 HeartBeat. All rights reserved.
//               </Typography>
//             </Box>
//           </Box>
//         );
//
//       default:
//         return null;
//     }
//   };
//
//   return (
//     <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh" }}>
//       <Header />
//
//       <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "250px 1fr" },
//             gap: 3,
//           }}
//         >
//           {/* Sidebar */}
//           <Box>
//             <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
//               <List sx={{ p: 0 }}>
//                 {menuItems.map((item, index) => (
//                   <Box key={item.id}>
//                     <ListItemButton
//                       selected={activeSection === item.id}
//                       onClick={() => setActiveSection(item.id as SettingSection)}
//                       sx={{
//                         py: 1.5,
//                         "&.Mui-selected": {
//                           bgcolor: "primary.main",
//                           color: "white",
//                           "& .MuiListItemIcon-root": {
//                             color: "white",
//                           },
//                           "&:hover": {
//                             bgcolor: "primary.dark",
//                           },
//                         },
//                       }}
//                     >
//                       <ListItemIcon
//                         sx={{
//                           minWidth: 40,
//                           color: activeSection === item.id ? "white" : "inherit",
//                         }}
//                       >
//                         {item.icon}
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={item.label}
//                         primaryTypographyProps={{
//                           fontSize: { xs: "0.875rem", sm: "1rem" },
//                         }}
//                       />
//                     </ListItemButton>
//                     {index < menuItems.length - 1 && <Divider />}
//                   </Box>
//                 ))}
//               </List>
//             </Paper>
//           </Box>
//
//           {/* Content */}
//           <Box>
//             <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, sm: 3, md: 4 } }}>
//               {renderContent()}
//             </Paper>
//           </Box>
//         </Box>
//       </Container>
//
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };
//
// export default Settings;
