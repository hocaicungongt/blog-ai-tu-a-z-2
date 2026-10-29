# Góc nhỏ của mình

Blog tĩnh tiếng Việt chia sẻ kiến thức học AI cho người mới, được xây bằng Vite và HTML/CSS/JavaScript thuần, không có backend. Blog hỗ trợ tìm kiếm không dấu, chế độ tối theo máy và đọc bài Markdown trên điện thoại.

## Chạy trên máy

Cài Node.js phiên bản 22.12 trở lên. Mở terminal trong thư mục dự án và chạy:

```bash
npm install
npm run dev
```

Mở địa chỉ mà terminal hiển thị để xem blog. Nhấn `Ctrl + C` để dừng.

## Thêm bài viết

Tạo file `.md` trong thư mục `posts/`, ví dụ `posts/lam-quen-voi-ai.md`:

```markdown
---
title: Làm quen với AI
date: 2026-10-29
excerpt: Những bước đầu tiên để tìm hiểu AI một cách dễ dàng.
---

## Bắt đầu từ đâu?

Viết nội dung bài tại đây. Bạn có thể dùng **chữ đậm**, danh sách và ảnh.
```

Giữ phần đầu giữa hai dòng `---`, điền đủ `title`, `date`, `excerpt`. Ngày dùng định dạng `YYYY-MM-DD`. Nên đặt tên file bằng chữ thường, không dấu và nối các từ bằng dấu `-`.

Bài mới tự xuất hiện ở trang chủ, sắp xếp theo ngày mới nhất trước. Ví dụ trên có đường dẫn `#/bai/lam-quen-voi-ai`.

## Deploy trên Vercel

Dự án được triển khai (deploy) miễn phí trên Vercel với gói Hobby. Để triển khai bản của bạn, đưa mã nguồn lên GitHub rồi nhập repository vào Vercel, chọn cấu hình **Vite**, lệnh build `npm run build` và thư mục đầu ra `dist`.

Bạn có thể kiểm tra bản build trên máy trước khi deploy:

```bash
npm run build
npm run preview
```
