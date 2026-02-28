# Admin User Management - Hướng dẫn sử dụng

## Tổng quan
Đã tích hợp đầy đủ chức năng quản lý user (Members và Trainers) vào trang Admin Dashboard với các tính năng:
- ✅ Thêm user mới (Create)
- ✅ Chỉnh sửa user (Update)
- ✅ Xóa user (Delete)
- ✅ Hiển thị danh sách user theo role
- ✅ Modal popup cho các thao tác
- ✅ Thêm role TRAINER vào hệ thống

## Các thay đổi Backend

### 1. Thêm Role TRAINER
File: `PowerGymBackEnd_Aptech04/src/main/java/com/example/project_backend04/config/DataInitializer.java`
- Tự động tạo role TRAINER khi khởi động ứng dụng
- Role TRAINER dành cho huấn luyện viên gym

### 2. Cập nhật UserResponse DTO
File: `PowerGymBackEnd_Aptech04/src/main/java/com/example/project_backend04/dto/response/User/UserResponse.java`
- Thêm field `createDate` để hiển thị ngày tham gia
- Thêm field `bio` và `coverPhoto`

### 3. API Endpoints đã có sẵn
```
GET    /api/admin/users          - Lấy danh sách tất cả users
POST   /api/admin/user           - Tạo user mới
PUT    /api/admin/user/{id}      - Cập nhật user
DELETE /api/admin/user/{id}      - Xóa user

GET    /api/admin/roles          - Lấy danh sách roles
POST   /api/admin/role           - Tạo role mới
PUT    /api/admin/role/{id}      - Cập nhật role
DELETE /api/admin/role/{id}      - Xóa role
```

## Các thay đổi Frontend

### 1. Service Layer
File: `PowerGym_aptech04/src/services/adminService.ts`
- Tạo mới service để gọi các API admin
- Export các interface: `Role`, `UserRequest`, `UserResponse`
- Các function: `getAllUsers`, `createUser`, `updateUser`, `deleteUser`, `getAllRoles`

### 2. Components mới

#### UserFormModal
File: `PowerGym_aptech04/src/components/PowerGym/AdminDashboard/UserFormModal.tsx`
- Modal form để thêm/sửa user
- Validate form data
- Hỗ trợ cả mode create và edit
- Dropdown chọn role

#### DeleteConfirmModal
File: `PowerGym_aptech04/src/components/PowerGym/AdminDashboard/DeleteConfirmModal.tsx`
- Modal xác nhận xóa
- Hiển thị warning icon
- Loading state khi đang xóa

### 3. Cập nhật Components

#### MembersTable
File: `PowerGym_aptech04/src/components/PowerGym/AdminDashboard/MembersTable.tsx`
- Tích hợp API calls
- Lọc chỉ hiển thị user có role USER
- Thêm các button Add, Edit, Delete
- Loading và error handling

#### TrainersGrid
File: `PowerGym_aptech04/src/components/PowerGym/AdminDashboard/TrainersGrid.tsx`
- Tích hợp API calls
- Lọc chỉ hiển thị user có role TRAINER
- Card layout hiển thị thông tin trainer
- Thêm các button Add, Edit, Delete

#### AdminDashboard
File: `PowerGym_aptech04/src/pages/Admin/AdminDashboard.tsx`
- Đơn giản hóa code, loại bỏ mock data
- Components tự quản lý state và API calls

## Cách sử dụng

### 1. Khởi động Backend
```bash
cd PowerGymBackEnd_Aptech04
./mvnw spring-boot:run
```

### 2. Khởi động Frontend
```bash
cd PowerGym_aptech04
npm install
npm run dev
```

### 3. Đăng nhập Admin
- Email: `admin@gmail.com`
- Password: `Admin01+`

### 4. Truy cập Admin Dashboard
- URL: `http://localhost:5173/admin/dashboard`
- Tab "Members": Quản lý thành viên (role USER)
- Tab "Trainers": Quản lý huấn luyện viên (role TRAINER)

## Test các chức năng

### Test Members Management
1. Click tab "Members"
2. Click "Add Member" để thêm member mới
   - Nhập email, password, họ tên, số điện thoại
   - Chọn role "USER"
   - Click "Thêm"
3. Click icon Edit để sửa thông tin member
4. Click icon Delete để xóa member

### Test Trainers Management
1. Click tab "Trainers"
2. Click "Add Trainer" để thêm trainer mới
   - Nhập email, password, họ tên, số điện thoại
   - Chọn role "TRAINER"
   - Click "Thêm"
3. Click icon Edit để sửa thông tin trainer
4. Click icon Delete để xóa trainer

## Lưu ý
- Tất cả API đều yêu cầu authentication với role ADMIN
- Email phải unique trong hệ thống
- Password bắt buộc khi tạo mới, optional khi update
- Khi update mà không nhập password thì password cũ được giữ nguyên
- Dữ liệu được load tự động khi vào trang
- Có loading spinner khi đang fetch data
- Có error alert khi có lỗi xảy ra

## Các role trong hệ thống
- `USER`: Thành viên gym thông thường
- `TRAINER`: Huấn luyện viên
- `ADMIN`: Quản trị viên hệ thống
