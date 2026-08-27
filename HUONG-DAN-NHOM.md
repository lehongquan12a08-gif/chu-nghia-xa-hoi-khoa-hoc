# Hướng dẫn nhóm — Bảo tàng "Từ tem phiếu đến mã QR" (MLN131 · Chương 3)

Bản hiện tại là **bảo tàng ảnh thuần thị giác**: 4 gian theo giai đoạn, không màn
thuyết minh, không câu hỏi — chạy tự lướt một lượt là hết chuyện.

## Chạy thử
```
npm install
npm run dev -- -p 3002
```

## Việc còn lại (theo độ ưu tiên)

### 1. Đổi domain Vercel (tên gốc bị nhóm khác chiếm!)
`chu-nghia-xa-hoi-khoa-hoc.vercel.app` đang là web "Triết học Marx-Lenin" của
nhóm khác. Vào Vercel → project → Settings → Domains → Add:
`tu-tem-phieu-den-ma-qr.vercel.app` (đã kiểm còn trống).

### 2. Giải trình AI (BẮT BUỘC của assignment — nộp NGOÀI web)
Màn giải trình đã bỏ khỏi web theo quyết định nhóm → phải nộp kèm 1 trang
Word/slide: khâu nào AI hỗ trợ (code, đồ họa, nhạc), khâu nào người làm và kiểm
chứng (chọn ảnh, đối chiếu giáo trình/số liệu, duyệt từng màn). Ghi nhật ký ngay
từng buổi, đừng để cuối kỳ.

### 3. Thay ảnh tư liệu (quyết định điểm thị giác — xem `NGUON-ANH.md`)
9 ô đang là khung chờ. Ưu tiên: xếp hàng mậu dịch → Đại hội VI → tem phiếu scan
→ Khoán 10. Ảnh QR vỉa hè + cặp ảnh cùng-góc-phố xưa/nay: nhóm tự chụp.
Thay ảnh: bỏ file `.webp` vào `public/images/csk/` rồi sửa `src` trong `app/page.tsx`.

### 4. Lồng tiếng (tùy chọn — web hiện chạy thuần nhạc, đã ổn)
Nếu sau này muốn có giọng đọc: thu 4 hồi → `public/audio/voice/hoi1..4.m4a`,
mở comment trong `data/narration.ts` (hệ khóa-cuộn-theo-giọng chờ sẵn).

## Kỹ thuật đã lo xong
Engine kế thừa web Kháng chiến (tự lướt + dừng nhịp, chống rơi chữ, F11 giữ vị
trí, mobile ổn định); bảng màu sepia→màu; nhạc nền tự soạn (Rê thứ → Rê trưởng,
vòng 96s không khục); tường ảnh + lightbox; kéo màn thời gian; deploy tự động
khi push GitHub (luôn `git pull` trước khi push khi làm đôi).

## Nguồn nội dung đã kiểm chứng
Giáo trình CNXHKH 2021 (Chương 3) · Cương lĩnh 2011 (8 đặc trưng) · Văn kiện Đại
hội VI ("nhìn thẳng vào sự thật", 15–18/12/1986) & IX (nội hàm "bỏ qua") · lạm
phát 1986: 774,7% · GDP ~14 tỷ USD (1985) → ~430 tỷ (2023), nghèo 58% (1993) →
dưới 3%, XNK >730 tỷ USD (2022): Tổng cục Thống kê / World Bank.
