// import { useState } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   Avatar,
//   // Typography,
//   // Button,
//   Tabs,
//   Tab,
//   Card,
//   CardMedia,
//   CardContent,
//   IconButton,
//   Chip,
//   Divider,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   PhotoCamera as PhotoCameraIcon,
//   LocationOn as LocationIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   Favorite as FavoriteIcon,
//   Comment as CommentIcon,
//   Share as ShareIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../../routes/AuthContext";
// import Header from "../../components/Home/Header";
//
// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }
//
// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div hidden={value !== index} {...other}>
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// }
//
// // Mock data for posts
// const mockPosts = [
//   {
//     id: 1,
//     image: "https://picsum.photos/400/300?random=1",
//     likes: 234,
//     comments: 45,
//   },
//   {
//     id: 2,
//     image: "https://picsum.photos/400/300?random=2",
//     likes: 189,
//     comments: 32,
//   },
//   {
//     id: 3,
//     image: "https://picsum.photos/400/300?random=3",
//     likes: 456,
//     comments: 78,
//   },
//   {
//     id: 4,
//     image: "https://picsum.photos/400/300?random=4",
//     likes: 321,
//     comments: 56,
//   },
//   {
//     id: 5,
//     image: "https://picsum.photos/400/300?random=5",
//     likes: 567,
//     comments: 89,
//   },
//   {
//     id: 6,
//     image: "https://picsum.photos/400/300?random=6",
//     likes: 234,
//     comments: 43,
//   },
// ];
//
// const Profile = () => {
//   const { user } = useAuth();
//   const [tabValue, setTabValue] = useState(0);
//
//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };
//
//   return (
//     <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh" }}>
//       <Header />
//
//       <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
//         {/* Cover Photo & Profile Info */}
//         <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
//           {/* Cover Photo */}
//           <Box
//             sx={{
//               height: { xs: 200, sm: 300, md: 400 },
//               bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               position: "relative",
//             }}
//           >
//             <IconButton
//               sx={{
//                 position: "absolute",
//                 bottom: 16,
//                 right: 16,
//                 bgcolor: "white",
//                 "&:hover": { bgcolor: "grey.100" },
//               }}
//             >
//               <PhotoCameraIcon />
//             </IconButton>
//           </Box>
//
//           {/* Profile Info */}
//           <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 2 }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 alignItems: { xs: "center", sm: "flex-end" },
//                 gap: 2,
//                 mt: { xs: -6, sm: -8 },
//               }}
//             >
//               {/* Avatar */}
//               <Box sx={{ position: "relative" }}>
//                 <Avatar
//                   src={user?.fullName ? `https://ui-avatars.com/api/?name=${user.fullName}&size=200` : undefined}
//                   sx={{
//                     width: { xs: 120, sm: 160 },
//                     height: { xs: 120, sm: 160 },
//                     border: "4px solid white",
//                   }}
//                 />
//                 <IconButton
//                   sx={{
//                     position: "absolute",
//                     bottom: 0,
//                     right: 0,
//                     bgcolor: "primary.main",
//                     color: "white",
//                     "&:hover": { bgcolor: "primary.dark" },
//                     width: 40,
//                     height: 40,
//                   }}
//                 >
//                   <PhotoCameraIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//
//               {/* Name & Stats */}
//               <Box
//                 sx={{
//                   flex: 1,
//                   textAlign: { xs: "center", sm: "left" },
//                   mt: { xs: 2, sm: 0 },
//                 }}
//               >
//                 <Typography variant="h4" fontWeight="bold" gutterBottom>
//                   {user?.fullName || user?.username || "User"}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" gutterBottom>
//                   @{user?.username}
//                 </Typography>
//
//                 <Box
//                   sx={{
//                     display: "flex",
//                     gap: 3,
//                     mt: 2,
//                     justifyContent: { xs: "center", sm: "flex-start" },
//                   }}
//                 >
//                   <Box>
//                     <Typography variant="h6" fontWeight="bold">
//                       1,234
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Posts
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="h6" fontWeight="bold">
//                       5,678
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Followers
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="h6" fontWeight="bold">
//                       890
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Following
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//
//               {/* Edit Profile Button */}
//               <Button
//                 variant="contained"
//                 startIcon={<EditIcon />}
//                 sx={{
//                   alignSelf: { xs: "stretch", sm: "center" },
//                   mb: { xs: 0, sm: 2 },
//                 }}
//               >
//                 Edit Profile
//               </Button>
//             </Box>
//
//             {/* Bio & Info */}
//             <Box sx={{ mt: 3 }}>
//               <Typography variant="body1" paragraph>
//                 🎨 Creative Designer | 📸 Photography Enthusiast | ✈️ Travel Lover
//               </Typography>
//
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
//                 <Chip icon={<WorkIcon />} label="Software Engineer" />
//                 <Chip icon={<LocationIcon />} label="Ho Chi Minh City, Vietnam" />
//                 <Chip icon={<SchoolIcon />} label="University of Technology" />
//               </Box>
//             </Box>
//           </Box>
//         </Paper>
//
//         {/* Tabs */}
//         <Paper elevation={2} sx={{ borderRadius: 2 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="fullWidth"
//             sx={{
//               borderBottom: 1,
//               borderColor: "divider",
//               "& .MuiTab-root": {
//                 textTransform: "none",
//                 fontSize: { xs: "0.875rem", sm: "1rem" },
//                 fontWeight: 600,
//               },
//             }}
//           >
//             <Tab label="Posts" />
//             <Tab label="About" />
//             <Tab label="Photos" />
//           </Tabs>
//
//           {/* Posts Tab */}
//           <TabPanel value={tabValue} index={0}>
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "repeat(2, 1fr)",
//                   sm: "repeat(3, 1fr)",
//                 },
//                 gap: 1,
//               }}
//             >
//               {mockPosts.map((post) => (
//                   <Card
//                     sx={{
//                       position: "relative",
//                       "&:hover .overlay": {
//                         opacity: 1,
//                       },
//                     }}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="200"
//                       image={post.image}
//                       alt={`Post ${post.id}`}
//                       sx={{ objectFit: "cover" }}
//                     />
//                     <Box
//                       className="overlay"
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         bgcolor: "rgba(0,0,0,0.5)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 2,
//                         opacity: 0,
//                         transition: "opacity 0.3s",
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
//                         <FavoriteIcon sx={{ mr: 0.5 }} />
//                         <Typography>{post.likes}</Typography>
//                       </Box>
//                       <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
//                         <CommentIcon sx={{ mr: 0.5 }} />
//                         <Typography>{post.comments}</Typography>
//                       </Box>
//                     </Box>
//                   </Card>
//               ))}
//             </Box>
//           </TabPanel>
//
//           {/* About Tab */}
//           <TabPanel value={tabValue} index={1}>
//             <Box sx={{ px: { xs: 2, sm: 3 } }}>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 About
//               </Typography>
//               <Divider sx={{ mb: 3 }} />
//
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
//                   gap: 3,
//                 }}
//               >
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Email
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     {user?.email || "Not provided"}
//                   </Typography>
//                 </Box>
//
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Username
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     {user?.username}
//                   </Typography>
//                 </Box>
//
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Role
//                   </Typography>
//                   <Chip
//                     label={user?.role || "USER"}
//                     color="primary"
//                     size="small"
//                   />
//                 </Box>
//
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Member Since
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     January 2024
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </TabPanel>
//
//           {/* Photos Tab */}
//           <TabPanel value={tabValue} index={2}>
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "repeat(2, 1fr)",
//                   sm: "repeat(3, 1fr)",
//                   md: "repeat(4, 1fr)",
//                 },
//                 gap: 2,
//                 px: { xs: 1, sm: 2 },
//               }}
//             >
//               {mockPosts.map((post) => (
//                   <Card>
//                     <CardMedia
//                       component="img"
//                       height="150"
//                       image={post.image}
//                       alt={`Photo ${post.id}`}
//                       sx={{ objectFit: "cover" }}
//                     />
//                     <CardContent sx={{ p: 1 }}>
//                       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                         <IconButton size="small">
//                           <FavoriteIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton size="small">
//                           <CommentIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton size="small">
//                           <ShareIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </CardContent>
//                   </Card>
//               ))}
//             </Box>
//           </TabPanel>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };
//
// export default Profile;
