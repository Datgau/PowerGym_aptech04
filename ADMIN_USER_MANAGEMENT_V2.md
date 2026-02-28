# Admin User Management V2 - Cập nhật

## Các thay đổi mới

### Backend Changes

#### 1. Tạo user không cần password
- File: `CreateUserRequest.java` - Đã xóa field `password`
- File: `AdminService.java` - Tự động tạo password ngẫu nhiên
- Password được tạo theo quy tắc: 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt

#### 2. Gửi password qua email
- File: `EmailService.java` - Thêm method `sendPasswordEmail()`
- Email template đẹp với thông tin đăng nhập
- Gửi tự động sau khi tạo user thành công

#### 3. Thêm role STAFF
- File: `DataInitializer.java` - Tự động tạo role STAFF khi khởi động
- Role STAFF dành cho nhân viên gym

#### 4. Bảo vệ role ADMIN
- File: `AdminService.java` - Không cho phép xóa role ADMIN
- Trả về lỗi 403 khi cố gắng xóa ADMIN role

### Frontend Changes

#### 1. UserFormModal - Loại bỏ password field
- Không còn field nhập password
- Hiển thị thông báo: "Mật khẩu sẽ được tạo tự động và gửi qua email"
- Thêm prop `allowedRoles` để giới hạn roles có thể chọn
- Role không thể thay đổi khi edit

#### 2. MembersTable - Quản lý USER và STAFF
- Chỉ hiển thị user có role USER hoặc STAFF
- Thêm filter toggle để lọc theo role:
  - Tất cả
  - User
  - Staff
- Hiển thị số lượng từng loại
- Thêm cột Role với Chip màu khác nhau
- Khi tạo mới chỉ cho chọn role USER hoặc STAFF

#### 3. TrainersGrid - Chuyển sang dạng Table
- Đổi từ Grid layout sang Table layout (giống MembersTable)
- Chỉ hiển thị user có role TRAINER
- Khi tạo mới chỉ cho chọn role TRAINER
- Giao diện nhất quán với MembersTable

## Cấu trúc Roles

### USER
- Thành viên gym thông thường
- Được quản lý trong tab Members
- Có thể tạo mới từ Members tab

### STAFF
- Nhân viên gym
- Được quản lý trong tab Members
- Có thể tạo mới từ Members tab
- Chip màu secondary (tím)

### TRAINER
- Huấn luyện viên
- Được quản lý trong tab Trainers
- Chỉ có thể tạo mới từ Trainers tab
- Chip màu success (xanh lá)

### ADMIN
- Quản trị viên hệ thống
- KHÔNG thể xóa
- KHÔNG thể tạo mới từ giao diện admin
- Chỉ có thể tạo qua database hoặc script

## API Endpoints

### User Management
```
POST   /api/admin/user
Body: {
  "email": "user@example.com",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0123456789",
  "roleId": 1
}
Response: Password được gửi qua email

PUT    /api/admin/user/{id}
Body: {
  "fullName": "Nguyen Van A Updated",
  "phoneNumber": "0987654321"
}
Note: Không thể thay đổi email và role

DELETE /api/admin/user/{id}
Response: 200 OK

GET    /api/admin/users
Response: Danh sách tất cả users
```

### Role Management
```
GET    /api/admin/roles
Response: Danh sách tất cả roles

DELETE /api/admin/role/{id}
Response: 403 nếu cố xóa ADMIN role
```

## Quy trình tạo user mới

1. Admin mở form tạo user
2. Nhập email, họ tên, số điện thoại
3. Chọn role (USER/STAFF cho Members, TRAINER cho Trainers)
4. Submit form
5. Backend:
   - Tạo password ngẫu nhiên 12 ký tự
   - Mã hóa password
   - Lưu user vào database
   - Gửi email chứa password cho user
6. User nhận email với thông tin đăng nhập
7. User đăng nhập và nên đổi password

## Email Template

Email gửi cho user mới bao gồm:
- Logo và header PowerGym
- Lời chào với tên user
- Email đăng nhập
- Password tạm thời (hiển thị rõ ràng)
- Cảnh báo đổi password sau khi đăng nhập
- Link đăng nhập

## Testing

### Test tạo Member (USER)
1. Vào tab Members
2. Click "Add Member"
3. Nhập thông tin, chọn role USER
4. Submit
5. Kiểm tra email đã nhận được password
6. Đăng nhập với email và password từ email

### Test tạo Staff
1. Vào tab Members
2. Click "Add Member"
3. Nhập thông tin, chọn role STAFF
4. Submit
5. Kiểm tra trong danh sách có chip màu tím (STAFF)
6. Test filter chỉ hiển thị STAFF

### Test tạo Trainer
1. Vào tab Trainers
2. Click "Add Trainer"
3. Nhập thông tin (chỉ có role TRAINER)
4. Submit
5. Kiểm tra email và đăng nhập

### Test filter Members
1. Tạo vài USER và STAFF
2. Click toggle "User" - chỉ hiển thị USER
3. Click toggle "Staff" - chỉ hiển thị STAFF
4. Click toggle "Tất cả" - hiển thị cả hai

### Test bảo vệ ADMIN role
1. Thử xóa role ADMIN qua API
2. Kết quả: Nhận lỗi 403 Forbidden

## Lưu ý quan trọng

1. **Email Service**: Đảm bảo SendGrid API key đã được cấu hình đúng
2. **Password Security**: Password được mã hóa trước khi lưu database
3. **Role Protection**: ADMIN role được bảo vệ ở cả frontend và backend
4. **User Experience**: Thông báo rõ ràng về việc password được gửi qua email
5. **Error Handling**: Xử lý lỗi khi gửi email thất bại (user vẫn được tạo)

## Cấu hình cần thiết

### Backend (application.yaml)
```yaml
sendgrid:
  api-key: ${SENDGRID_API_KEY}
  from-email: noreply@powergym.com
```

### Environment Variables
```
SENDGRID_API_KEY=your_sendgrid_api_key
```
