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
    caption: 'Kế hoạch hóa tập trung, quan liêu, bao cấp — cả nước mua bán bằng tem phiếu.',
    image: '/images/csk/baocap-maudich.webp',
    symbol: 'letter',
    background: BG_SEPIA,
    pos: 'center 35%',
  },

  // GIAN 2 — Khúc quanh: Đại hội VI (12/1986) — màu bắt đầu tràn vào
  doiMoi: {
    id: 'gian-2',
    year: '12/1986',
    eyebrow: 'Gian trưng bày thứ hai · Đại hội đại biểu toàn quốc lần thứ VI',
    heading: 'Khúc quanh',
    keyText: 'NHÌN THẲNG VÀO SỰ THẬT',
    caption: 'Đại hội VI (15–18/12/1986) mở đường lối Đổi mới — kinh tế nhiều thành phần.',
    image: '/images/csk/dh6.webp',
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
    caption: 'Khoán 10 (1988) · xuất khẩu gạo trở lại (1989) · ASEAN (1995) · WTO (2007).',
    image: '/images/csk/gian3.webp',
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
    caption: 'GDP: ~14 → ~430 tỷ USD · tỷ lệ nghèo: 58% → dưới 3% (World Bank).',
    image: '/images/csk/wm-skyline.webp',
    symbol: 'flag',
    background: BG_NAY,
    pos: 'center 30%',
  },
};
