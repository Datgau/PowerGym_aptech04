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
            Hướng Dẫn Xóa Dữ Liệu Người Dùng
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            HeartBeat - Social Network
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Alert severity="info" sx={{ mb: 4 }}>
          Nếu bạn muốn xóa dữ liệu cá nhân đã cung cấp cho HeartBeat thông qua đăng nhập
          Facebook, Google hoặc tài khoản email, bạn có thể thực hiện theo các bước sau.
        </Alert>

        {/* Section 1 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Email color="primary" />
            <Typography variant="h5" fontWeight={600}>
              1. Cách yêu cầu xóa dữ liệu
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Gửi email đến: <Link href="mailto:dattn12042001@gmail.com" fontWeight={600}>dattn12042001@gmail.com</Link>
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Tiêu đề:</strong> "Yêu cầu xóa dữ liệu người dùng - HeartBeat"
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Nội dung cần cung cấp:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>ID tài khoản hoặc email đăng nhập</li>
            <li>Phương thức đăng nhập (Email, Facebook, Google)</li>
            <li>Lý do xóa dữ liệu (tùy chọn)</li>
          </Box>
        </Box>

        {/* Section 2 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Delete color="error" />
            <Typography variant="h5" fontWeight={600}>
              2. Dữ liệu sẽ bị xóa
            </Typography>
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Khi bạn yêu cầu xóa tài khoản, các dữ liệu sau sẽ bị xóa vĩnh viễn và không thể khôi phục:
          </Alert>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Thông tin tài khoản (email, tên, username)</li>
            <li>Ảnh đại diện và ảnh bìa</li>
            <li>Tất cả bài viết, hình ảnh, video đã đăng</li>
            <li>Bình luận và tương tác (likes, shares)</li>
            <li>Tin nhắn và cuộc trò chuyện</li>
            <li>Thông tin OAuth (Facebook, Google)</li>
            <li>Stories và nội dung tạm thời</li>
          </Box>
        </Box>

        {/* Section 3 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Security color="primary" />
            <Typography variant="h5" fontWeight={600}>
              3. Dữ liệu được giữ lại
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Một số dữ liệu có thể được giữ lại theo yêu cầu pháp lý:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Logs hệ thống (để bảo mật và phòng chống gian lận) - tối đa 90 ngày</li>
            <li>Dữ liệu thanh toán (nếu có, theo quy định pháp luật) - tối đa 7 năm</li>
            <li>Báo cáo vi phạm đã được xử lý - theo quy định pháp luật</li>
          </Box>
        </Box>

        {/* Section 4 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Schedule color="success" />
            <Typography variant="h5" fontWeight={600}>
              4. Thời gian xử lý
            </Typography>
          </Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Sau khi nhận yêu cầu, chúng tôi sẽ xóa toàn bộ dữ liệu liên quan trong vòng
            <strong> 48 giờ</strong> theo chính sách của Facebook và Google.
          </Alert>
          <Typography variant="body1">
            Bạn sẽ nhận được email xác nhận khi quá trình xóa dữ liệu hoàn tất.
          </Typography>
        </Box>

        {/* Section 5 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Xóa dữ liệu OAuth (Facebook/Google)
          </Typography>
          <Typography variant="body1" paragraph>
            Nếu bạn đăng nhập bằng Facebook hoặc Google, bạn cũng có thể thu hồi quyền truy cập:
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Thu hồi quyền truy cập Facebook:
            </Typography>
            <Box component="ol" sx={{ pl: 3, m: 0 }}>
              <li>Vào <strong>Facebook → Settings & Privacy → Settings</strong></li>
              <li>Chọn <strong>Apps and Websites</strong></li>
              <li>Tìm <strong>HeartBeat</strong> và click <strong>Remove</strong></li>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Thu hồi quyền truy cập Google:
            </Typography>
            <Box component="ol" sx={{ pl: 3, m: 0 }}>
              <li>Vào <Link href="https://myaccount.google.com/security" target="_blank">Google Account → Security</Link></li>
              <li>Chọn <strong>Third-party apps with account access</strong></li>
              <li>Tìm <strong>HeartBeat</strong> và click <strong>Remove Access</strong></li>
            </Box>
          </Paper>
        </Box>

        {/* Section 6 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Liên hệ hỗ trợ
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "#e3f2fd" }}>
            <Typography variant="body1" paragraph>
              Nếu bạn có bất kỳ câu hỏi nào về việc xóa dữ liệu, vui lòng liên hệ:
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              <li>
                Email: <Link href="mailto:dattn12042001@gmail.com" fontWeight={600}>
                  dattn12042001@gmail.com
                </Link>
              </li>
              <li>Thời gian phản hồi: Trong vòng 24 giờ</li>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Cam kết của chúng tôi
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            HeartBeat cam kết tôn trọng quyền riêng tư của bạn và tuân thủ các quy định về
            bảo vệ dữ liệu cá nhân (GDPR, CCPA). Chúng tôi sẽ xử lý yêu cầu xóa dữ liệu của bạn
            một cách nhanh chóng, minh bạch và bảo mật.
          </Typography>
          <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mt: 3 }}>
            Cảm ơn bạn đã sử dụng HeartBeat. Chúng tôi rất tiếc khi bạn rời đi và hy vọng
            sẽ được phục vụ bạn trong tương lai.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
