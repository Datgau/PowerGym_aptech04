# Hướng dẫn Test Admin User Management

## Chuẩn bị
1. Backend đã chạy: `http://localhost:8080`
2. Frontend đã chạy: `http://localhost:5173`
3. Đăng nhập với admin: `admin@gmail.com` / `Admin01+`

## Test Case 1: Tạo Member (USER)

### Bước thực hiện:
1. Truy cập: `http://localhost:5173/admin/dashboard`
2. Click tab "Members"
3. Click button "Add Member"
4. Nhập thông tin:
   - Email: `member1@test.com`
   - Họ và tên: `Nguyễn Văn A`
   - Số điện thoại: `0123456789`
   - Vai trò: Chọn `USER`
5. Click "Thêm"

### Kết quả mong đợi:
- ✅ Modal đóng lại
- ✅ Danh sách members reload và hiển thị user mới
- ✅ User mới có chip màu xanh (USER)
- ✅ Email `member1@test.com` nhận được email chứa password
- ✅ Console backend không có lỗi

### Kiểm tra email:
- Subject: "🔑 Thông tin đăng nhập PowerGym"
- Nội dung có:
  - Email đăng nhập: `member1@test.com`
  - Mật khẩu tạm thời: (12 ký tự ngẫu nhiên)
  - Link đăng nhập

## Test Case 2: Tạo Staff

### Bước thực hiện:
1. Ở tab "Members"
2. Click "Add Member"
3. Nhập thông tin:
   - Email: `staff1@test.com`
   - Họ và tên: `Trần Thị B`
   - Số điện thoại: `0987654321`
   - Vai trò: Chọn `STAFF`
4. Click "Thêm"

### Kết quả mong đợi:
- ✅ User mới có chip màu tím (STAFF)
- ✅ Email được gửi thành công

## Test Case 3: Filter Members

### Bước thực hiện:
1. Tạo thêm 2-3 USER và 2-3 STAFF
2. Click toggle "User"
3. Click toggle "Staff"
4. Click toggle "Tất cả"

### Kết quả mong đợi:
- ✅ Toggle "User": Chỉ hiển thị users có role USER
- ✅ Toggle "Staff": Chỉ hiển thị users có role STAFF
- ✅ Toggle "Tất cả": Hiển thị cả USER và STAFF
- ✅ Số lượng hiển thị đúng trên mỗi toggle button

## Test Case 4: Tạo Trainer

### Bước thực hiện:
1. Click tab "Trainers"
2. Click "Add Trainer"
3. Nhập thông tin:
   - Email: `trainer1@test.com`
   - Họ và tên: `Lê Văn C`
   - Số điện thoại: `0912345678`
   - Vai trò: Chỉ có `TRAINER` (không thể chọn role khác)
4. Click "Thêm"

### Kết quả mong đợi:
- ✅ Trainer mới hiển thị trong table
- ✅ Chip màu xanh lá (TRAINER)
- ✅ Email được gửi thành công
- ✅ Giao diện table giống Members

## Test Case 5: Edit User

### Bước thực hiện:
1. Click icon Edit ở một user bất kỳ
2. Thay đổi:
   - Họ và tên: `Nguyễn Văn A Updated`
   - Số điện thoại: `0999999999`
3. Click "Lưu"

### Kết quả mong đợi:
- ✅ Thông tin được cập nhật
- ✅ Email và Role không thể thay đổi (disabled)
- ✅ Không gửi email mới

## Test Case 6: Delete User

### Bước thực hiện:
1. Click icon Delete ở một user
2. Xác nhận trong modal
3. Click "Xóa"

### Kết quả mong đợi:
- ✅ Modal xác nhận hiển thị
- ✅ User bị xóa khỏi danh sách
- ✅ Danh sách reload

## Test Case 7: Đăng nhập với user mới

### Bước thực hiện:
1. Logout khỏi admin
2. Mở email nhận được
3. Copy password từ email
4. Đăng nhập với:
   - Email: `member1@test.com`
   - Password: (từ email)

### Kết quả mong đợi:
- ✅ Đăng nhập thành công
- ✅ Redirect về trang home
- ✅ Không có quyền truy cập admin

## Test Case 8: Kiểm tra bảo vệ ADMIN role

### Test qua API (Postman/Thunder Client):
```
DELETE http://localhost:8080/api/admin/role/2
Authorization: Bearer {admin_token}
```

### Kết quả mong đợi:
- ✅ Status: 403 Forbidden
- ✅ Message: "Không thể xóa role ADMIN"

## Test Case 9: Email không hợp lệ

### Bước thực hiện:
1. Tạo user với email đã tồn tại
2. Click "Thêm"

### Kết quả mong đợi:
- ✅ Hiển thị lỗi: "Email đã tồn tại"
- ✅ Modal không đóng
- ✅ User không được tạo

## Test Case 10: Responsive Design

### Bước thực hiện:
1. Mở DevTools (F12)
2. Chuyển sang mobile view (375px)
3. Test các chức năng

### Kết quả mong đợi:
- ✅ Table responsive, có scroll ngang
- ✅ Buttons và filters hiển thị đúng
- ✅ Modal hiển thị full width
- ✅ Các cột ẩn/hiện phù hợp với màn hình

## Checklist tổng quan

### Backend:
- [ ] Role STAFF được tạo tự động khi start
- [ ] Password được generate ngẫu nhiên (12 ký tự)
- [ ] Email được gửi thành công
- [ ] ADMIN role không thể xóa
- [ ] API create user không yêu cầu password

### Frontend:
- [ ] Members tab hiển thị USER và STAFF
- [ ] Trainers tab hiển thị TRAINER
- [ ] Filter toggle hoạt động đúng
- [ ] Modal form không có field password
- [ ] Thông báo "Mật khẩu sẽ được gửi qua email"
- [ ] Role không thể thay đổi khi edit
- [ ] Giao diện Members và Trainers nhất quán

### Email:
- [ ] Template đẹp, có logo PowerGym
- [ ] Hiển thị email và password rõ ràng
- [ ] Có cảnh báo đổi password
- [ ] Link đăng nhập hoạt động

## Lỗi thường gặp

### 1. NoSuchMethodError: getPassword()
**Nguyên nhân:** MapStruct chưa rebuild
**Giải pháp:** 
- Xóa file `target/generated-sources/annotations/.../UserMapperImpl.java`
- Rebuild project

### 2. Email không được gửi
**Nguyên nhân:** SendGrid API key chưa cấu hình
**Giải pháp:**
- Kiểm tra `application.yaml`
- Set environment variable `SENDGRID_API_KEY`

### 3. 403 Forbidden khi gọi API
**Nguyên nhân:** Không có quyền ADMIN
**Giải pháp:**
- Đăng nhập lại với admin account
- Kiểm tra token trong localStorage

### 4. Filter không hoạt động
**Nguyên nhân:** Role name không khớp
**Giải pháp:**
- Kiểm tra role name trong database (USER, STAFF, TRAINER)
- Case sensitive

## Notes

- Password format: 12 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt
- Email template sử dụng SendGrid
- Role ADMIN chỉ có thể tạo qua database
- Khi edit user, không thể thay đổi email và role
- Filter chỉ áp dụng cho Members tab (USER và STAFF)
