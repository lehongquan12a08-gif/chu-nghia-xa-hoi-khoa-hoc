import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // BẢNG MÀU "BAO CẤP → ĐỔI MỚI": giữ nguyên TÊN lớp (vn-*) để engine cũ
        // chạy không sửa, nhưng GIÁ TRỊ đổi sang sepia giấy tem phiếu + dấu đỏ.
        'vn-red': '#B3271E', // dấu mực đỏ bao cấp (trầm hơn đỏ cờ)
        'vn-red-deep': '#7E1B14',
        'vn-gold': '#E9B84C', // vàng dữ liệu — mù tạt cũ, không neon
        'vn-gold-antique': '#B98A3C',
        'vn-ivory': '#F0E6CE', // giấy ngả vàng
        'vn-brown': '#6A5232',
        'vn-charcoal': '#191308',
        'vn-black': '#14100A', // đen sepia ấm
        'dm-teal': '#2E9C8E', // teal Đổi mới — chỉ dùng từ màn 1986 trở đi
      },
      fontFamily: {
        display: ['var(--font-be-vietnam)', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-be-vietnam)', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace'], // máy đánh chữ — trích giáo trình
      },
      letterSpacing: {
        cinematic: '0.35em',
        wide2: '0.18em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
