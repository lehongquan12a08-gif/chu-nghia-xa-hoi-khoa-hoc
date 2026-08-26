// Màn ảnh điện ảnh full-screen — cao trào của hành trình.
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

const BG_DOIMOI = 'linear-gradient(180deg, #14100a 0%, #123430 55%, #14100a 100%)';

export const MILESTONES: Record<string, Milestone> = {
  // CAO TRÀO: Đại hội VI (15–18/12/1986) — màn hình bắt đầu CÓ MÀU từ đây
  doiMoi: {
    id: 'ch-1986',
    year: '12/1986',
    eyebrow: 'Đại hội đại biểu toàn quốc lần thứ VI của Đảng · 15–18/12/1986',
    heading: 'Đổi mới',
    keyText: 'NHÌN THẲNG VÀO SỰ THẬT',
    caption:
      '4.247 ngày sau toàn thắng 30/04/1975, Đại hội VI đề ra đường lối Đổi mới toàn diện — "nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật" — phát triển nền kinh tế nhiều thành phần, mở đường đưa đất nước ra khỏi khủng hoảng kinh tế – xã hội.',
    image: '/images/csk/dh6.svg',
    symbol: 'star',
    background: BG_DOIMOI,
    pos: 'center 25%',
  },
};
