// ẢNH CHỦ của mỗi GIAN trưng bày — màn full-bleed mở đầu từng giai đoạn
// (như bức tranh chính treo ở cửa mỗi phòng bảo tàng).
export type MilestoneSymbol = 'letter' | 'flag' | 'sickle' | 'star';

export interface Milestone {
  id: string;
  year: string;
  eyebrow: string;
  heading: string;
  keyText: string; // câu "nhấn" lớn
  caption: string;
  image: string;
  symbol: MilestoneSymbol;
  background: string;
  contain?: boolean;
  /** object-position cho ảnh full-bleed (vd 'center 10%') — mặc định 'center 22%'. */
  pos?: string;
}

const BG_SEPIA = 'radial-gradient(ellipse at center, #241c10 0%, #14100a 72%)';
const BG_DOIMOI = 'linear-gradient(180deg, #14100a 0%, #123430 55%, #14100a 100%)';
const BG_NAY = 'linear-gradient(180deg, #14100a 0%, #10201d 55%, #14100a 100%)';

export const MILESTONES: Record<string, Milestone> = {
  // GIAN 1 — Đêm trước Đổi mới (1975–1985)
  gian1: {
    id: 'gian-1',
    year: '1975–1985',
    eyebrow: 'Gian trưng bày thứ nhất',
    heading: 'Đêm trước Đổi mới',
    keyText: 'THẮNG HAI ĐẾ QUỐC — VẪN THIẾU GẠO ĂN',
    caption:
      'Đất nước bước ra khỏi chiến tranh với nền nông nghiệp lạc hậu, bị bao vây cấm vận; cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp khiến sản xuất đình đốn — mua bán bằng tem phiếu, xếp hàng trước cửa hàng mậu dịch.',
    image: '/images/csk/baocap-xephang.svg',
    symbol: 'letter',
    background: BG_SEPIA,
    pos: 'center 30%',
  },

  // GIAN 2 — Khúc quanh: Đại hội VI (12/1986) — màu bắt đầu tràn vào
  doiMoi: {
    id: 'gian-2',
    year: '12/1986',
    eyebrow: 'Gian trưng bày thứ hai · Đại hội đại biểu toàn quốc lần thứ VI',
    heading: 'Khúc quanh',
    keyText: 'NHÌN THẲNG VÀO SỰ THẬT',
    caption:
      '4.247 ngày sau toàn thắng 30/04/1975, Đại hội VI (15–18/12/1986) đề ra đường lối Đổi mới toàn diện — "nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật" — phát triển nền kinh tế nhiều thành phần, mở đường ra khỏi khủng hoảng.',
    image: '/images/csk/dh6.svg',
    symbol: 'star',
    background: BG_DOIMOI,
    pos: 'center 25%',
  },

  // GIAN 3 — Cửa mở (1986–2007)
  gian3: {
    id: 'gian-3',
    year: '1986–2007',
    eyebrow: 'Gian trưng bày thứ ba',
    heading: 'Cửa mở',
    keyText: 'TỪ THIẾU GẠO ĐẾN XUẤT KHẨU GẠO',
    caption:
      'Khoán 10 (1988) cởi trói cho nông nghiệp; năm 1989 Việt Nam trở lại xuất khẩu gạo. Gia nhập ASEAN (28/07/1995), bình thường hóa quan hệ Việt – Mỹ (1995), gia nhập WTO (11/01/2007) — nền kinh tế nhiều thành phần từng bước hội nhập thế giới.',
    image: '/images/csk/gian3.svg',
    symbol: 'sickle',
    background: BG_NAY,
    pos: 'center 30%',
  },

  // GIAN 4 — Chương đang viết (hôm nay)
  gian4: {
    id: 'gian-4',
    year: 'HÔM NAY',
    eyebrow: 'Gian trưng bày thứ tư',
    heading: 'Chương đang viết',
    keyText: 'CON HỔ MỚI CỦA CHÂU Á',
    caption:
      'GDP từ khoảng 14 tỷ USD (1985) lên khoảng 430 tỷ USD (2023); tỷ lệ nghèo từ 58% (1993) xuống dưới 3% — nguồn: Tổng cục Thống kê, World Bank. Thời kỳ quá độ chưa kết thúc: chương cuối do chính chúng ta viết.',
    image: '/images/csk/wm-skyline.webp',
    symbol: 'flag',
    background: BG_NAY,
    pos: 'center 30%',
  },
};
