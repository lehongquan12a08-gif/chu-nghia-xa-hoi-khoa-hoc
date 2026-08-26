'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';

// 8 đặc trưng của xã hội XHCN mà nhân dân ta xây dựng — Cương lĩnh (bổ sung,
// phát triển năm 2011). Nguyên văn rút gọn giữ đúng từ khóa. % là ẨN DỤ THỊ
// GIÁC "đang xây dựng" — cố ý KHÔNG thanh nào chạm 100%.
const DAC_TRUNG: Array<{ text: string; pct: number }> = [
  { text: 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh', pct: 82 },
  { text: 'Do nhân dân làm chủ', pct: 86 },
  { text: 'Kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và quan hệ sản xuất tiến bộ phù hợp', pct: 74 },
  { text: 'Nền văn hóa tiên tiến, đậm đà bản sắc dân tộc', pct: 84 },
  { text: 'Con người có cuộc sống ấm no, tự do, hạnh phúc, có điều kiện phát triển toàn diện', pct: 78 },
  { text: 'Các dân tộc bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển', pct: 88 },
  { text: 'Nhà nước pháp quyền XHCN của nhân dân, do nhân dân, vì nhân dân, do Đảng Cộng sản lãnh đạo', pct: 85 },
  { text: 'Quan hệ hữu nghị và hợp tác với các nước trên thế giới', pct: 92 },
];

/**
 * THANH TIẾN ĐỘ DANG DỞ — 8 đặc trưng Cương lĩnh 2011 hiện thành các thanh
 * đang xây, không thanh nào đầy: hình ảnh hóa đúng khái niệm "quá độ".
 */
export default function ProgressBars8({ id }: { id?: string }) {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn(true)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={root}
      data-dwell="5"
      className="relative flex min-h-screen items-center justify-center px-6 py-[12vh]"
      style={{ background: 'linear-gradient(180deg, #14100a 0%, #10201d 60%, #14100a 100%)' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3 text-vn-gold-antique">Cương lĩnh xây dựng đất nước (bổ sung, phát triển năm 2011)</p>
          <h2 className="text-balance font-display text-[26px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(38px,2.8vw,54px)]">
            8 đặc trưng — đang xây dựng
          </h2>
          <div className="gold-line mx-auto mb-9 mt-6 w-32" />
        </Reveal>

        <div className="flex flex-col gap-4">
          {DAC_TRUNG.map((d, i) => (
            <Reveal key={i}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-pretty font-body text-[14px] leading-snug text-vn-ivory/90 md:text-[length:clamp(16px,1.05vw,20px)]">
                  <span className="mr-2 font-typewriter text-[12px] text-vn-gold-antique md:text-[13px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {d.text}
                </p>
              </div>
              <div className="mt-2 h-[9px] w-full overflow-hidden rounded-sm bg-[rgba(240,230,206,0.1)]">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: on ? `${d.pct}%` : '0%',
                    background: 'linear-gradient(90deg, #b98a3c, #e9b84c)',
                    boxShadow: '0 0 14px rgba(233,184,76,0.35)',
                    transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.14}s`,
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9 text-center">
          <p className="text-balance font-body text-[14px] leading-relaxed text-vn-ivory/65 md:text-[16.5px]">
            Không thanh nào chạm 100% — vì <b className="text-vn-gold">thời kỳ quá độ</b> nghĩa là
            <b className="text-vn-gold"> chưa kết thúc</b>. Đó không phải điểm yếu của lý luận;
            đó chính là nội dung của lý luận.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
