// Mục "Nghe & Xem" — video/bản thu đặt trong public/video (file cục bộ).
export interface MediaItem {
  src: string; // đường dẫn trong public/
  title: string;
  kind: string; // 'Bài hát' | 'Tư liệu' ...
  by?: string;
}

export const MEDIA: MediaItem[] = [
  {
    src: '/video/tien-quan-ca.mp4',
    title: 'Tiến Quân Ca',
    kind: 'Quốc ca',
    by: 'Nhạc: Văn Cao · Thu thanh trước 1975',
  },
  {
    src: '/video/lang-toi.mp4',
    title: 'Làng Tôi',
    kind: 'Bài hát',
    by: 'Nhạc: Văn Cao · Thu thanh trước 1975',
  },
  {
    src: '/video/ho-keo-phao.mp4',
    title: 'Hò Kéo Pháo',
    kind: 'Bài hát',
    by: 'Nhạc: Hoàng Vân · Tốp ca nam',
  },
  {
    src: '/video/chien-thang-dien-bien.mp4',
    title: 'Chiến Thắng Điện Biên',
    kind: 'Bài hát',
    by: 'Nhạc: Đỗ Nhuận · Thu thanh cuối thập niên 50',
  },
];
