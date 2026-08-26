'use client';

import Reveal from '@/components/Reveal';
import { verifiedQuote } from '@/data/timeline';

/**
 * NGÃ BA LỊCH SỬ — năm 1975, hai con đường tự xổ ra theo nhịp cuộn (không cần
 * bấm), hội tụ về luận điểm Hồ Chí Minh: quá độ BỎ QUA chế độ tư bản chủ nghĩa.
 */
export default function NgaBa({ id }: { id?: string }) {
  return (
    <section
      id={id}
      data-dwell="4"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-[14vh]"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #241c10 0%, #14100a 72%)' }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3 text-vn-gold-antique">Năm 1975 · Ngã ba lịch sử</p>
          <h2 className="text-balance font-display text-[26px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(38px,2.8vw,54px)]">
            Trước Việt Nam là hai con đường
          </h2>
          <div className="gold-line mx-auto mb-10 mt-6 w-32" />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="border border-vn-ivory/20 bg-[rgba(240,230,206,0.04)] p-7 md:p-9">
            <p className="font-typewriter text-[12px] uppercase tracking-[0.2em] text-vn-ivory/50">
              Con đường thứ nhất
            </p>
            <h3 className="mt-3 font-display text-xl font-bold uppercase leading-snug text-vn-ivory/85 md:text-[length:clamp(24px,1.8vw,34px)]">
              Phát triển tuần tự
            </h3>
            <p className="mt-4 text-pretty font-body text-[15px] leading-relaxed text-vn-ivory/75 md:text-[length:clamp(17px,1.15vw,21px)]">
              Kinh qua giai đoạn phát triển tư bản chủ nghĩa — đi lại con đường hàng
              trăm năm của các nước phương Tây, chấp nhận những mâu thuẫn và bất công
              mà chính con đường ấy sinh ra.
            </p>
          </Reveal>
          <Reveal className="border-2 border-vn-red/70 bg-[rgba(179,39,30,0.08)] p-7 md:p-9">
            <p className="font-typewriter text-[12px] uppercase tracking-[0.2em] text-vn-red">
              Con đường thứ hai — Việt Nam chọn
            </p>
            <h3 className="mt-3 font-display text-xl font-bold uppercase leading-snug text-vn-red md:text-[length:clamp(24px,1.8vw,34px)]">
              Quá độ bỏ qua chế độ tư bản chủ nghĩa
            </h3>
            <p className="mt-4 text-pretty font-body text-[15px] leading-relaxed text-vn-ivory/85 md:text-[length:clamp(17px,1.15vw,21px)]">
              Đi lên chủ nghĩa xã hội từ một nước nông nghiệp lạc hậu — con đường chưa
              có tiền lệ, dài và khó, nhưng nhất quán với mục tiêu độc lập dân tộc gắn
              liền chủ nghĩa xã hội đã chọn từ năm 1930.
            </p>
          </Reveal>
        </div>

        {/* luận điểm gốc — kiểu máy đánh chữ trên nền giấy */}
        <Reveal className="mx-auto mt-10 max-w-4xl border border-vn-gold-antique/30 bg-[rgba(240,230,206,0.05)] p-7 text-center md:p-10">
          <p className="text-balance font-typewriter text-[16px] leading-relaxed text-vn-ivory md:text-[length:clamp(19px,1.4vw,26px)]">
            “{verifiedQuote.text}”
          </p>
          <p className="mt-5 font-body text-[12px] uppercase tracking-[0.24em] text-vn-gold md:text-[14px]">
            — {verifiedQuote.attribution}
          </p>
          <p className="mt-1.5 font-typewriter text-[11px] tracking-[0.1em] text-vn-ivory/50 md:text-[12.5px]">
            {verifiedQuote.context}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
