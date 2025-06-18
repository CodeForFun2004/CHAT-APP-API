# Project Checklist – ChatApp MERN Backend (Project-Based Learning)

## 1. User Features

- [x] Tạo user (POST /api/users)
- [x] Lấy danh sách user
- [x] Lấy thông tin user theo ID
- [x] Lấy thông tin chi tiết (profile + friend count)
- [x] Thêm avatar
- [x] Danh sách bạn bè

## 2. Kết bạn & Lời mời

- [x] Gửi lời mời kết bạn (POST /api/friends/request)
- [x] Lấy danh sách lời mời đến (GET /api/friends/requests/:userId)
- [x] Chấp nhận lời mời (PATCH /api/friends/accept/:id)
- [x] Từ chối lời mời (PATCH /api/friends/reject/:id)

## 3. Chat Channel

- [x] Tạo channel khi kết bạn thành công
- [x] API ẩn / hiện kênh (PATCH /api/channels/:id/hide)
- [x] Lấy danh sách kênh của 1 user
- [x] Lấy tất cả kênh (cho admin)
- [x] Thống kê số kênh

## 4. Chat Message

- [x] Gửi tin nhắn (POST /api/messages)
- [x] Lấy tin nhắn theo channel
- [x] Sắp xếp tin nhắn theo thời gian
- [x] Trả về danh sách seenBy

## 5. Real-Time (WebSocket)

- [x] Kết nối đến server qua Socket.IO
- [x] Gửi tin nhắn real-time
- [x] Seen message real-time
- [ ] (Tùy chọn) Hiển thị "User is typing..."

## 6. Test & Dev Tooling

- [x] Test API bằng Postman
- [x] Test WebSocket bằng client script
- [ ] Thêm script seed.js để tạo user mẫu nhanh

## 7. (Gợi ý mở rộng) Auth + Security

- [x] Thêm xác thực JWT: đăng ký / đăng nhập
- [x] Middleware bảo vệ API
- [x] Chỉ user đúng mới xem được kênh chat

## 8. (Gợi ý mở rộng) Admin Dashboard

- [ ] API thống kê:
  - [x] Tổng user
  - [x] Tổng channel
  - [x] Tổng message
- [x] Quản lí danh sách user   GET /api/admin/users?filter=active/banned
- [x] Chặn gửi tin nhắn nếu bị ban
- [x]  Tìm kiếm user / filter
- [x]  Ban/Unban user

- [ ] Top 5 user nhiều bạn bè
- [ ] Top 5 user gửi nhiều message
- [ ] Edit profile upddate ảnh lên cloudinary