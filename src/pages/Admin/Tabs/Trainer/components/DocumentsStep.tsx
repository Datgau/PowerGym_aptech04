import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Paper,
  Tooltip,
  Avatar,
  Fade,
  Stack
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";

import {
  CloudUpload,
  Add,
  Delete,
  PhotoCamera,
  InsertDriveFile,
  Verified
} from "@mui/icons-material";

import { DOCUMENT_TYPES } from "../../../../../services/trainerService";

/* ---------- Styled ---------- */

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    transition: "box-shadow .2s",
    "&:hover fieldset": { borderColor: "#0066ff" },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(0,102,255,0.1)"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0066ff",
      borderWidth: 2
    }
  },
  "& label.Mui-focused": { color: "#0066ff" }
}));

const StyledFormControl = styled(FormControl)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    transition: "box-shadow .2s",
    "&:hover fieldset": { borderColor: "#0066ff" },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(0,102,255,0.1)"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0066ff",
      borderWidth: 2
    }
  },
  "& label.Mui-focused": { color: "#0066ff" }
}));

/* Avatar: tròn, không nét đứt */
const AvatarCircle = styled(Box)<{ haspreview: string }>(({ haspreview }) => ({
  width: 110,
  height: 110,
  borderRadius: "50%",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  flexShrink: 0,
  boxShadow:
      haspreview === "true"
          ? "0 0 0 3px #0066ff"
          : "0 0 0 2px #d0d7e8",
  background: haspreview === "true" ? "transparent" : "#f0f3fb",
  transition: "box-shadow .2s, transform .15s",
  "&:hover": {
    boxShadow: "0 0 0 3px #0066ff",
    transform: "scale(1.03)",
    "& .avatar-overlay": { opacity: 1 }
  }
}));

/* Cover: khung chữ nhật to */
const CoverZone = styled(Box)<{ haspreview: string }>(({ haspreview }) => ({
  width: "100%",
  height: 160,
  borderRadius: 14,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  border: haspreview === "true" ? "none" : "2px dashed #d0d7e8",
  background: haspreview === "true" ? "transparent" : "#fafbff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all .2s",
  "&:hover": {
    borderColor: "#0066ff",
    background: haspreview === "true" ? "transparent" : alpha("#0066ff", 0.04),
    "& .cover-overlay": { opacity: 1 }
  }
}));

const DocumentCard = styled(Card)(() => ({
  borderRadius: 14,
  border: "1.5px solid #e8ecf4",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  transition: "border-color .2s, box-shadow .2s",
  "&:hover": {
    borderColor: alpha("#0066ff", 0.3),
    boxShadow: "0 4px 18px rgba(0,102,255,0.07)"
  }
}));

/* ---------- Component — props giữ nguyên như bản gốc ---------- */

const DocumentsStep = ({
                         avatarPreview,
                         coverPreview,
                         documents,
                         handleAvatarUpload,
                         handleCoverUpload,
                         handleDocumentUpload,
                         updateDocument,
                         removeDocument
                       }: any) => {
  return (
      <Fade in timeout={300}>
        <Box>

          {/* HEADER */}
          <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
            <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg,#00b4ff22,#0066ff22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
            >
              <CloudUpload sx={{ color: "#0066ff", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={16} color="#1a2340" lineHeight={1.3}>
                Documents & Media
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Upload profile photos and certification documents
              </Typography>
            </Box>
          </Stack>

          {/* AVATAR + COVER */}
          <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              mb={3}
              alignItems={{ md: "flex-end" }}
          >

            {/* ── Avatar: hình tròn, không nét đứt ── */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Typography fontWeight={600} fontSize={13} color="#1a2340" alignSelf="flex-start">
                Profile Avatar
              </Typography>

              <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
              />

              <label htmlFor="avatar-upload">
                <AvatarCircle haspreview={avatarPreview ? "true" : "false"}>
                  {avatarPreview ? (
                      <img
                          src={avatarPreview}
                          alt="Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                  ) : (
                      <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <PhotoCamera sx={{ fontSize: 28, color: "#b0bad0" }} />
                        <Typography fontSize={10} color="#b0bad0" mt={0.5} fontWeight={600}>
                          Upload
                        </Typography>
                      </Stack>
                  )}

                  {/* hover overlay */}
                  <Box
                      className="avatar-overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity .2s"
                      }}
                  >
                    <PhotoCamera sx={{ color: "#fff", fontSize: 24 }} />
                  </Box>
                </AvatarCircle>
              </label>

              <Typography fontSize={11} color="text.secondary">
                JPG, PNG · 300×300px
              </Typography>
            </Box>

            <Box flex={1} width="100%">
              <Typography fontWeight={600} fontSize={13} color="#1a2340" mb={1}>
                Cover Photo
              </Typography>

              <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="cover-upload"
                  type="file"
                  onChange={handleCoverUpload}
              />

              <label htmlFor="cover-upload" style={{ display: "block" }}>
                <CoverZone haspreview={coverPreview ? "true" : "false"}>
                  {coverPreview ? (
                      <img
                          src={coverPreview}
                          alt="Cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                  ) : (
                      <Stack alignItems="center" spacing={1}>
                        <CloudUpload sx={{ fontSize: 34, color: "#b0bad0" }} />
                        <Typography fontSize={13} fontWeight={600} color="#9aa3b8">
                          Upload cover photo
                        </Typography>
                        <Typography fontSize={11} color="#b8bfd0">
                          JPG, PNG · recommended 1200×400px
                        </Typography>
                      </Stack>
                  )}

                  {/* hover overlay khi đã có ảnh */}
                  {coverPreview && (
                      <Box
                          className="cover-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            opacity: 0,
                            transition: "opacity .2s"
                          }}
                      >
                        <CloudUpload sx={{ color: "#fff", fontSize: 28 }} />
                        <Typography fontSize={13} fontWeight={600} color="#fff">
                          Click to change
                        </Typography>
                      </Box>
                  )}
                </CoverZone>
              </label>
            </Box>
          </Stack>

          {/* DOCUMENTS */}
          <Stack spacing={2}>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={600} fontSize={13} color="#1a2340">
                Certificates & Documents
              </Typography>

              <input
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  style={{ display: "none" }}
                  id="documents-upload"
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
              />

              <label htmlFor="documents-upload">
                <Button
                    component="span"
                    size="small"
                    startIcon={<Add />}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#0066ff",
                      color: "#0066ff",
                      "&:hover": { background: alpha("#0066ff", 0.06) }
                    }}
                >
                  Add Document
                </Button>
              </label>
            </Stack>

            {/* EMPTY */}
            {documents.length === 0 && (
                <Paper
                    elevation={0}
                    sx={{
                      border: "2px dashed #d0d7e8",
                      borderRadius: 3,
                      p: 4,
                      textAlign: "center",
                      background: "#fafbff"
                    }}
                >
                  <InsertDriveFile sx={{ fontSize: 40, color: "#c8d0e4", mb: 1 }} />
                  <Typography fontSize={13} fontWeight={600} color="#9aa3b8">
                    No documents added
                  </Typography>
                  <Typography fontSize={12} color="#b8bfd0" mt={0.5}>
                    Click "Add Document" to upload certificates
                  </Typography>
                </Paper>
            )}

            {/* LIST */}
            {documents.map((doc: any, index: number) => (
                <DocumentCard key={index} variant="outlined">
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>

                    {/* file info row */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2,
                              background: alpha("#0066ff", 0.1),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            }}
                        >
                          <InsertDriveFile sx={{ color: "#0066ff", fontSize: 18 }} />
                        </Box>

                        <Typography
                            fontSize={13}
                            fontWeight={600}
                            color="#1a2340"
                            noWrap
                            sx={{ maxWidth: { xs: 140, sm: 260 } }}
                        >
                          {doc.file.name}
                        </Typography>

                        <Chip
                            label={`${(doc.file.size / 1024).toFixed(0)} KB`}
                            size="small"
                            sx={{ fontSize: 11, height: 22, flexShrink: 0 }}
                        />
                      </Stack>

                      <Tooltip title="Remove" arrow>
                        <IconButton
                            size="small"
                            onClick={() => removeDocument(index)}
                            sx={{
                              color: "#e53935",
                              background: "#fff0f0",
                              borderRadius: 2,
                              ml: 1,
                              flexShrink: 0,
                              "&:hover": { background: "#ffe0e0" }
                            }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    {/* FORM — logic giữ nguyên, chỉ đổi layout */}
                    <Stack spacing={2}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                        <StyledFormControl fullWidth size="small">
                          <InputLabel>Document Type</InputLabel>
                          <Select
                              label="Document Type"
                              value={doc.documentType}
                              onChange={(e) => updateDocument(index, "documentType", e.target.value)}
                          >
                            {DOCUMENT_TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value}>
                                  {t.label}
                                </MenuItem>
                            ))}
                          </Select>
                        </StyledFormControl>

                        <StyledTextField
                            fullWidth
                            size="small"
                            label="Expiry Date"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            value={doc.expiryDate || ""}
                            onChange={(e) => updateDocument(index, "expiryDate", e.target.value)}
                        />

                      </Stack>

                      <StyledTextField
                          fullWidth
                          size="small"
                          label="Description"
                          value={doc.description}
                          onChange={(e) => updateDocument(index, "description", e.target.value)}
                      />
                    </Stack>

                  </CardContent>
                </DocumentCard>
            ))}

          </Stack>
        </Box>
      </Fade>
  );
};

export default DocumentsStep;