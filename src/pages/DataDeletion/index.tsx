import { Box, Container, Typography, Paper, Divider, Link, Alert } from "@mui/material";
import { Delete, Email, Security, Schedule } from "@mui/icons-material";

export default function DataDeletion() {
  return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Delete sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              User Data Deletion Guide
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              PowerGym - Fitness & Gym Network
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Last updated: {new Date().toLocaleDateString("en-US")}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Alert severity="info" sx={{ mb: 4 }}>
            If you wish to delete personal data provided to PowerGym through
            Facebook, Google login, or your email account, please follow the steps below.
          </Alert>

          {/* Section 1 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Email color="primary" />
              <Typography variant="h5" fontWeight={600}>
                1. How to Request Data Deletion
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Send an email to: <Link href="mailto:dattn12042001@gmail.com" fontWeight={600}>dattn12042001@gmail.com</Link>
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Subject:</strong> "User Data Deletion Request - PowerGym"
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Required information:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>Account ID or login email</li>
              <li>Login method (Email, Facebook, or Google)</li>
              <li>Reason for data deletion (optional)</li>
            </Box>
          </Box>

          {/* Section 2 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Delete color="error" />
              <Typography variant="h5" fontWeight={600}>
                2. Data to Be Deleted
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              When you request account deletion, the following data will be permanently removed and cannot be recovered:
            </Alert>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>Account information (email, name, username)</li>
              <li>Profile picture and cover photo</li>
              <li>All posts, images, and videos</li>
              <li>Comments and interactions (likes, shares)</li>
              <li>Messages and conversations</li>
              <li>OAuth information (Facebook, Google)</li>
              <li>Stories and temporary content</li>
            </Box>
          </Box>

          {/* Section 3 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Security color="primary" />
              <Typography variant="h5" fontWeight={600}>
                3. Data We Retain
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Some data may be retained as required by applicable law:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>System logs (for security and fraud prevention) — maximum 90 days</li>
              <li>Payment data (if applicable, as required by law) — maximum 7 years</li>
              <li>Processed violation reports — as required by law</li>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Schedule color="success" />
              <Typography variant="h5" fontWeight={600}>
                4. Processing Time
              </Typography>
            </Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              After receiving your request, we will delete all related data within
              <strong> 48 hours</strong>, in accordance with Facebook and Google policies.
            </Alert>
            <Typography variant="body1">
              You will receive a confirmation email once the data deletion process is complete.
            </Typography>
          </Box>

          {/* Section 5 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              5. Revoke OAuth Access (Facebook / Google)
            </Typography>
            <Typography variant="body1" paragraph>
              If you signed in with Facebook or Google, you can also revoke PowerGym's access directly:
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revoke Facebook Access:
              </Typography>
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                <li>Go to <strong>Facebook → Settings & Privacy → Settings</strong></li>
                <li>Select <strong>Apps and Websites</strong></li>
                <li>Find <strong>PowerGym</strong> and click <strong>Remove</strong></li>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Revoke Google Access:
              </Typography>
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                <li>Go to <Link href="https://myaccount.google.com/security" target="_blank">Google Account → Security</Link></li>
                <li>Select <strong>Third-party apps with account access</strong></li>
                <li>Find <strong>PowerGym</strong> and click <strong>Remove Access</strong></li>
              </Box>
            </Paper>
          </Box>

          {/* Section 6 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              6. Support Contact
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, bgcolor: "#e3f2fd" }}>
              <Typography variant="body1" paragraph>
                If you have any questions about data deletion, please reach out to us:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                <li>
                  Email: <Link href="mailto:dattn12042001@gmail.com" fontWeight={600}>
                  dattn12042001@gmail.com
                </Link>
                </li>
                <li>Response time: Within 24 hours</li>
              </Box>
            </Paper>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Our Commitment
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              PowerGym is committed to respecting your privacy and complying with
              personal data protection regulations (GDPR, CCPA). We will process your data deletion request
              promptly, transparently, and securely.
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mt: 3 }}>
              Thank you for being part of the PowerGym community. We hope to serve you again in the future.
            </Typography>
          </Box>
        </Paper>
      </Container>
  );
}