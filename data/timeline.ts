// ---------------------------------------------------------------------------
//  DÒNG THỜI GIAN — Từ tem phiếu đến mã QR (MLN131 · Chương 3)
//  Thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam. Mốc đã kiểm chứng.
// ---------------------------------------------------------------------------

export interface TimelineEntry {
  id: string;
  year: string;
  short: string;
}

/** Các mốc hiển thị trên thanh Timeline Indicator (phải màn hình desktop). */
export const timelineMarkers: TimelineEntry[] = [
  { id: 'hero', year: 'SẢNH', short: 'Từ tem phiếu đến mã QR' },
  { id: 'gian-1', year: 'GIAN 1', short: 'Đêm trước Đổi mới · 1975–1985' },
  { id: 'gian-2', year: 'GIAN 2', short: 'Khúc quanh · 1986' },
  { id: 'gian-3', year: 'GIAN 3', short: 'Cửa mở · 1986–2007' },
  { id: 'gian-4', year: 'GIAN 4', short: 'Chương đang viết · hôm nay' },
  { id: 'ch-chuongcuoi', year: 'KẾT', short: 'Do chúng ta viết' },
];

/** Trích dẫn đã kiểm chứng — luận điểm trung tâm của chương. */
export const verifiedQuote = {
  text: 'Đặc điểm to nhất của ta trong thời kỳ quá độ là từ một nước nông nghiệp lạc hậu tiến thẳng lên chủ nghĩa xã hội không phải kinh qua giai đoạn phát triển tư bản chủ nghĩa.',
  attribution: 'Chủ tịch Hồ Chí Minh',
  context: 'Hồ Chí Minh Toàn tập · Nxb Chính trị quốc gia, 2011 · t.12, tr.411',
};

export const NAV_LINKS = [
  { label: 'Sảnh', href: '#hero' },
  { label: 'Gian 1 · Bao cấp', href: '#gian-1' },
  { label: 'Gian 2 · 1986', href: '#gian-2' },
  { label: 'Gian 3 · Cửa mở', href: '#gian-3' },
  { label: 'Gian 4 · Hôm nay', href: '#gian-4' },
  { label: 'Về dự án', href: '#footer' },
];
