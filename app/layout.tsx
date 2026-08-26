import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Be_Vietnam_Pro, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import FilmGrain from '@/components/FilmGrain';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

// máy đánh chữ — trích giáo trình/văn kiện, nhãn tem phiếu
const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TỪ TEM PHIẾU ĐẾN MÃ QR · Chủ nghĩa xã hội khoa học',
  description:
    'Thắng hai đế quốc mà vẫn thiếu gạo — vì sao? Hành trình thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam: từ tem phiếu bao cấp đến mã QR hôm nay. Triển lãm số môn MLN131 — Chương 3.',
  keywords: ['chủ nghĩa xã hội khoa học', 'thời kỳ quá độ', 'Đổi mới 1986', 'bao cấp', 'MLN131'],
};

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${beVietnam.variable} ${plexMono.variable}`}
    >
      <body className="bg-vn-black text-vn-ivory antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <FilmGrain />
      </body>
    </html>
  );
}
