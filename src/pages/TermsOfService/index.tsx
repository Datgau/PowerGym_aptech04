export default function TermsOfService() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Điều Khoản Dịch Vụ – HeartBeat</h1>
      <p>Cập nhật lần cuối: {new Date().toLocaleDateString()}</p>

      <p>
        Khi sử dụng HeartBeat, bạn đồng ý với các điều khoản sau. Vui lòng đọc kỹ trước
        khi tiếp tục sử dụng dịch vụ.
      </p>

      <h2>1. Chấp nhận điều khoản</h2>
      <p>
        Bằng việc đăng ký hoặc truy cập HeartBeat, bạn đồng ý tuân thủ toàn bộ điều khoản
        này. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
      </p>

      <h2>2. Tài khoản người dùng</h2>
      <ul>
        <li>Bạn có trách nhiệm bảo mật tài khoản và mật khẩu</li>
        <li>Không được giả mạo hoặc tạo tài khoản ảo để lừa đảo</li>
        <li>Không sử dụng HeartBeat vào mục đích vi phạm pháp luật</li>
      </ul>

      <h2>3. Nội dung người dùng</h2>
      <p>Bạn chịu trách nhiệm về nội dung mình đăng tải, bao gồm:</p>
      <ul>
        <li>Hình ảnh, video, bài viết</li>
        <li>Bình luận và tương tác</li>
      </ul>
      <p>Không được đăng nội dung chứa:</p>
      <ul>
        <li>Bạo lực, khiêu dâm, kích động thù địch</li>
        <li>Thông tin sai lệch gây ảnh hưởng cộng đồng</li>
        <li>Nội dung vi phạm bản quyền</li>
      </ul>

      <h2>4. Dịch vụ có thể thay đổi</h2>
      <p>
        Chúng tôi có quyền cập nhật, thay đổi hoặc tạm ngừng dịch vụ mà không cần
        thông báo trước, nhằm đảm bảo hệ thống được vận hành tốt nhất.
      </p>

      <h2>5. Quy định OAuth (Google, Facebook)</h2>
      <p>
        Khi đăng nhập bằng Google hoặc Facebook, bạn đồng ý rằng HeartBeat có thể
        truy cập dữ liệu cơ bản như: email, tên hiển thị, ảnh đại diện, theo chính
        sách của từng nhà cung cấp.
      </p>

      <h2>6. Xóa tài khoản và dữ liệu</h2>
      <p>
        Bạn có quyền yêu cầu xóa tài khoản và dữ liệu cá nhân bất kỳ lúc nào.
        Vui lòng xem{" "}
        <a href="/data-deletion" style={{ color: "#4285F4", textDecoration: "underline" }}>
          Hướng dẫn xóa dữ liệu người dùng
        </a>{" "}
        để biết chi tiết.
      </p>

      <h2>7. Liên hệ</h2>
      <p>
        Mọi thắc mắc vui lòng liên hệ:  
        <strong> HeartBeat.support@example.com</strong>
      </p>

      <p>Cảm ơn bạn đã sử dụng HearBeat.</p>
    </div>
  );
}
