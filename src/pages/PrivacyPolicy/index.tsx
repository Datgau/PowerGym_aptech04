export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Chính Sách Quyền Riêng Tư – HeartBeat</h1>
      <p>Cập nhật lần cuối: {new Date().toLocaleDateString()}</p>

      <p>
        Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân
        khi bạn sử dụng HeartBeat. Chính sách này mô tả cách chúng tôi thu thập, sử dụng
        và bảo vệ thông tin của bạn.
      </p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <ul>
        <li>Thông tin tài khoản (email, tên, username)</li>
        <li>Ảnh đại diện và nội dung bạn đăng tải</li>
        <li>Dữ liệu thiết bị và cookies</li>
        <li>Thông tin từ Google hoặc Facebook khi bạn đăng nhập bằng OAuth</li>
      </ul>

      <h2>2. Cách chúng tôi sử dụng thông tin</h2>
      <p>Chúng tôi sử dụng thông tin để:</p>
      <ul>
        <li>Vận hành nền tảng HeartBeat</li>
        <li>Cung cấp tính năng cá nhân hóa</li>
        <li>Ngăn chặn hành vi gian lận và bảo mật hệ thống</li>
        <li>Hỗ trợ khách hàng khi cần thiết</li>
      </ul>

      <h2>3. Chia sẻ thông tin</h2>
      <p>Chúng tôi KHÔNG bán dữ liệu người dùng. Tuy nhiên, chúng tôi có thể chia sẻ với:</p>
      <ul>
        <li>Nhà cung cấp dịch vụ (ví dụ: lưu trữ, phân tích)</li>
        <li>Cơ quan pháp lý khi được yêu cầu bởi luật pháp</li>
      </ul>

      <h2>4. Quyền của bạn</h2>
      <ul>
        <li>Yêu cầu truy cập hoặc xoá tài khoản</li>
        <li>Tải xuống dữ liệu cá nhân</li>
        <li>Thu hồi quyền truy cập OAuth</li>
      </ul>
      <p>
        Để xóa dữ liệu của bạn, vui lòng xem{" "}
        <a href="/data-deletion" style={{ color: "#4285F4", textDecoration: "underline" }}>
          Hướng dẫn xóa dữ liệu người dùng
        </a>.
      </p>

      <h2>5. Liên hệ</h2>
      <p>
        Nếu bạn có câu hỏi, vui lòng liên hệ:  
        <strong> HeartBeat.support@example.com</strong>
      </p>

      <p>Cảm ơn bạn đã tin tưởng sử dụng HeartBeat.</p>
    </div>
  );
}
