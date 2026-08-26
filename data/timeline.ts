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
  { id: 'hero', year: 'MỞ ĐẦU', short: 'Từ tem phiếu đến mã QR' },
  { id: 'ch-baocap', year: '1975', short: 'Đêm trước Đổi mới' },
  { id: 'ch-bando', year: 'LÝ LUẬN', short: 'Tấm bản đồ của Mác' },
  { id: 'ch-ngaba', year: 'NGÃ BA', short: 'Quá độ bỏ qua TBCN' },
  { id: 'ch-1986', year: '1986', short: 'Đổi mới' },
  { id: 'ch-homnay', year: 'HÔM NAY', short: 'Gần 40 năm Đổi mới' },
  { id: 'ch-chuongcuoi', year: 'CHƯƠNG CUỐI', short: 'Do chúng ta viết' },
];

/** Trích dẫn đã kiểm chứng — luận điểm trung tâm của chương. */
export const verifiedQuote = {
  text: 'Đặc điểm to nhất của ta trong thời kỳ quá độ là từ một nước nông nghiệp lạc hậu tiến thẳng lên chủ nghĩa xã hội không phải kinh qua giai đoạn phát triển tư bản chủ nghĩa.',
  attribution: 'Chủ tịch Hồ Chí Minh',
  context: 'Hồ Chí Minh Toàn tập · Nxb Chính trị quốc gia, 2011 · t.12, tr.411',
};

export const NAV_LINKS = [
  { label: 'Mở đầu', href: '#hero' },
  { label: 'Bao cấp', href: '#ch-baocap' },
  { label: 'Lý luận', href: '#ch-bando' },
  { label: 'Đổi mới', href: '#ch-1986' },
  { label: 'Hôm nay', href: '#ch-homnay' },
  { label: 'Về dự án', href: '#footer' },
];
