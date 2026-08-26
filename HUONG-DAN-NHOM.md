# Từ tem phiếu đến mã QR — MLN131 · Chương 3

Web thuyết trình "Thời kỳ quá độ lên CNXH ở Việt Nam". Dựng trên engine web
Kháng chiến chống Pháp (tự lướt, lồng tiếng khóa cuộn, nhạc nền, mobile audio-guide).

## Chạy thử
```
npm install
npm run dev -- -p 3002
```

## Việc cần làm tiếp (checklist nhóm)

### 1. Thay ảnh tư liệu (đang là Ô CHỜ ẢNH trong `public/images/csk/`)
| File cần thay | Nội dung | Nguồn gợi ý |
|---|---|---|
| `baocap-xephang.svg` → `.webp` | Xếp hàng mậu dịch quốc doanh | TTXVN / triển lãm "Thương nhớ thời bao cấp" |
| `baocap-sogao.svg` → `.webp` | Sổ gạo / tem phiếu thật (scan) | Bảo tàng Hà Nội / TTXVN |
| `bando-mac.svg` → `.webp` | Chân dung C. Mác | ảnh tư liệu public domain |
| `dh6.svg` → `.webp` | Đại hội VI · 12/1986 | TTXVN |
| `homnay-1.svg` / `homnay-2.svg` | Thành phố hôm nay / quét QR vỉa hè | nhóm TỰ CHỤP (bản quyền sạch) |
| `pho-xua.svg` / `pho-nay.svg` | Cặp ảnh CÙNG GÓC PHỐ xưa–nay (màn kéo gạt) | khó nhất — gom sớm; tạm thời đã có tranh vector |

Thay xong sửa `src` tương ứng trong `app/page.tsx` (đổi đuôi .svg → .webp).
Ảnh nào giữ tranh vector cũng được — bản quyền sạch 100%.

### 2. Lồng tiếng (Nguyên) — 4 hồi (~10–12 phút)
- Hồi 1 "Cơn đói sau ngày thắng" → `public/audio/voice/hoi1.m4a`
- Hồi 2 "Tấm bản đồ của Mác" → `hoi2.m4a`
- Hồi 3 "Ngã ba và khúc quanh" → `hoi3.m4a`
- Hồi 4 "Chương đang viết" → `hoi4.m4a`
Thu xong: mở comment trong `data/narration.ts` (giọng sẽ tự khóa nhịp cuộn).
Giọng kể trầm–chậm hồi 1–3, sáng dần hồi 4.

### 3. Deploy (làm 1 lần)
1. GitHub: tạo repo mới `Chu-nghia-xa-hoi-khoa-hoc` → `git remote add origin <url>` → `git push -u origin main`
2. Vercel: Add New Project → import repo → deploy (mặc định là được)

### 4. Nhật ký AI (đừng quên!)
Trang "Giải trình AI" cuối web lấy dữ liệu từ nhật ký làm việc — ghi ngay mỗi buổi:
làm khâu gì, AI hỗ trợ gì, ai kiểm chứng. Đây là hạng mục BẮT BUỘC của assignment.

## Nguồn nội dung đã kiểm chứng
- Giáo trình CNXHKH 2021 (không chuyên) — Chương 3: 6 đặc trưng CNXH, đặc điểm thời kỳ quá độ
- Cương lĩnh 2011 — 8 đặc trưng xã hội XHCN Việt Nam
- Văn kiện Đại hội IX — nội hàm "bỏ qua chế độ TBCN"
- Hồ Chí Minh Toàn tập, Nxb CTQG 2011, t.12, tr.411 — luận điểm quá độ bỏ qua
- Đại hội VI: 15–18/12/1986; lạm phát 1986: 774,7%; số bộ đếm 4.247 ngày = 30/04/1975 → 15/12/1986
- GDP ~14 tỷ USD (1985) → ~430 tỷ (2023): World Bank · Nghèo 58% (1993) → dưới 3%: TCTK/WB · XNK >730 tỷ USD (2022): TCTK
