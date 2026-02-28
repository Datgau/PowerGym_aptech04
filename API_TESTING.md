# API Testing với Postman/Thunder Client

## Setup

### 1. Đăng nhập để lấy token
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "Admin01+"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

Copy `accessToken` để dùng cho các request sau.

---

## User Management APIs

### 1. Lấy danh sách tất cả users

```http
GET http://localhost:8080/api/admin/users
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "Danh sách user",
  "data": [
    {
      "id": 1,
      "email": "admin@gmail.com",
      "fullName": null,
      "phoneNumber": null,
      "avatar": null,
      "bio": null,
      "coverPhoto": null,
      "createDate": "2026-02-28T10:00:00",
      "role": {
        "id": 2,
        "name": "ADMIN",
        "description": null
      }
    }
  ],
  "status": 200
}
```

---

### 2. Tạo user mới (USER)

```http
POST http://localhost:8080/api/admin/user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "user1@test.com",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0123456789",
  "roleId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo user thành công. Mật khẩu đã được gửi qua email.",
  "data": {
    "id": 5,
    "email": "user1@test.com",
    "fullName": "Nguyen Van A",
    "phoneNumber": "0123456789",
    "avatar": null,
    "bio": null,
    "coverPhoto": null,
    "createDate": "2026-02-28T16:30:00",
    "role": {
      "id": 1,
      "name": "USER",
      "description": null
    }
  },
  "status": 201
}
```

**Note:** Password được tạo tự động và gửi qua email `user1@test.com`

---

### 3. Tạo user mới (STAFF)

```http
POST http://localhost:8080/api/admin/user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "staff1@test.com",
  "fullName": "Tran Thi B",
  "phoneNumber": "0987654321",
  "roleId": 4
}
```

**Note:** roleId = 4 là STAFF (kiểm tra bằng API GET /api/admin/roles)

---

### 4. Tạo user mới (TRAINER)

```http
POST http://localhost:8080/api/admin/user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "trainer1@test.com",
  "fullName": "Le Van C",
  "phoneNumber": "0912345678",
  "roleId": 3
}
```

**Note:** roleId = 3 là TRAINER

---

### 5. Cập nhật user

```http
PUT http://localhost:8080/api/admin/user/5
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "Nguyen Van A Updated",
  "phoneNumber": "0999999999",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật user thành công",
  "data": {
    "id": 5,
    "email": "user1@test.com",
    "fullName": "Nguyen Van A Updated",
    "phoneNumber": "0999999999",
    "avatar": "https://example.com/avatar.jpg",
    "role": {
      "id": 1,
      "name": "USER"
    }
  },
  "status": 200
}
```

**Note:** Không thể thay đổi email và roleId

---

### 6. Xóa user

```http
DELETE http://localhost:8080/api/admin/user/5
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa user thành công",
  "data": null,
  "status": 200
}
```

---

## Role Management APIs

### 1. Lấy danh sách roles

```http
GET http://localhost:8080/api/admin/roles
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách role thành công",
  "data": [
    {
      "id": 1,
      "name": "USER",
      "description": null
    },
    {
      "id": 2,
      "name": "ADMIN",
      "description": null
    },
    {
      "id": 3,
      "name": "TRAINER",
      "description": "Trainer role for gym instructors"
    },
    {
      "id": 4,
      "name": "STAFF",
      "description": "Staff role for gym employees"
    }
  ],
  "status": 200
}
```

---

### 2. Tạo role mới

```http
POST http://localhost:8080/api/admin/role
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "MANAGER",
  "description": "Manager role"
}
```

---

### 3. Cập nhật role

```http
PUT http://localhost:8080/api/admin/role/5
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "id": 5,
  "name": "MANAGER",
  "description": "Manager role updated"
}
```

---

### 4. Xóa role (Không thể xóa ADMIN)

```http
DELETE http://localhost:8080/api/admin/role/2
Authorization: Bearer {accessToken}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Không thể xóa role ADMIN",
  "data": null,
  "status": 403
}
```

---

### 5. Xóa role khác (OK)

```http
DELETE http://localhost:8080/api/admin/role/5
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "Xóa role thành công",
  "data": null,
  "status": 200
}
```

---

## Error Cases

### 1. Email đã tồn tại

```http
POST http://localhost:8080/api/admin/user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "fullName": "Test",
  "roleId": 1
}
```

**Response:**
```json
{
  "success": false,
  "message": "Email đã tồn tại",
  "data": null,
  "status": 400
}
```

---

### 2. User không tồn tại

```http
PUT http://localhost:8080/api/admin/user/999
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "Test"
}
```

**Response:**
```json
{
  "success": false,
  "message": "User không tồn tại",
  "data": null,
  "status": 404
}
```

---

### 3. Không có quyền (không phải ADMIN)

```http
GET http://localhost:8080/api/admin/users
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "timestamp": "2026-02-28T16:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

## Postman Collection

Tạo collection với các request trên:

1. **Folder: Auth**
   - Login

2. **Folder: User Management**
   - Get All Users
   - Create User (USER)
   - Create User (STAFF)
   - Create User (TRAINER)
   - Update User
   - Delete User

3. **Folder: Role Management**
   - Get All Roles
   - Create Role
   - Update Role
   - Delete Role (ADMIN - should fail)
   - Delete Role (other)

### Environment Variables

```
base_url: http://localhost:8080
access_token: (set after login)
```

### Pre-request Script (cho các request cần auth)

```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('access_token')
});
```

### Test Script (cho Login request)

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set('access_token', jsonData.data.accessToken);
}
```
