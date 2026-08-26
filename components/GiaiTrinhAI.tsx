'use client';

import Reveal from '@/components/Reveal';

// GIẢI TRÌNH SỬ DỤNG AI CÓ TRÁCH NHIỆM — hạng mục bắt buộc của assignment
// MLN131. Bảng phân vai cập nhật theo nhật ký làm việc của nhóm.
const ROWS: Array<{ khau: string; ai: string; nguoi: string }> = [
  {
    khau: 'Kịch bản & cấu trúc kể chuyện',
    ai: 'Gợi ý mạch kể "trinh thám", phác thảo các màn trình chiếu',
    nguoi: 'Chọn concept, viết lời thoại cuối, đối chiếu từng luận điểm với Giáo trình CNXHKH 2021 (Chương 3)',
  },
  {
    khau: 'Nội dung lý luận',
    ai: 'Tổng hợp bản nháp các đặc trưng, khái niệm',
    nguoi: 'Kiểm chứng nguyên văn theo giáo trình, Cương lĩnh 2011, Văn kiện Đại hội VI & IX, Hồ Chí Minh Toàn tập (ghi tập/trang)',
  },
  {
    khau: 'Số liệu',
    ai: 'Gợi ý mốc so sánh trước–sau Đổi mới',
    nguoi: 'Chỉ giữ số có nguồn Tổng cục Thống kê / World Bank; chú nguồn ngay trên màn',
  },
  {
    khau: 'Lập trình web',
    ai: 'Sinh mã hiệu ứng cuộn, âm thanh, bố cục theo yêu cầu của nhóm',
    nguoi: 'Ra đề bài từng màn, duyệt trên máy chiếu, quyết định mọi chỉnh sửa',
  },
  {
    khau: 'Hình ảnh & âm nhạc',
    ai: 'Dựng đồ họa vector minh họa (tem phiếu, phố xưa–nay), soạn nhạc nền',
    nguoi: 'Chụp/tuyển ảnh tư liệu có ghi nguồn (TTXVN…), thu lồng tiếng, chọn tông',
  },
];

export default function GiaiTrinhAI({ id }: { id?: string }) {
  return (
    <section
      id={id}
      data-dwell="4"
      className="relative flex min-h-screen items-center justify-center px-6 py-[12vh]"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1c150c 0%, #14100a 72%)' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <span className="con-dau !text-[12px] md:!text-[14px]">Sử dụng AI có trách nhiệm</span>
          <h2 className="mt-5 text-balance font-display text-[26px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(36px,2.6vw,50px)]">
            AI làm gì — Con người làm gì
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-balance font-body text-[14px] leading-relaxed text-vn-ivory/70 md:text-[16.5px]">
            Theo đúng yêu cầu của môn học: ứng dụng AI có trách nhiệm, đạo đức — mọi nội dung
            lý luận, trích dẫn và số liệu đều do con người kiểm chứng và chịu trách nhiệm cuối cùng.
          </p>
        </Reveal>

        <div className="mt-9 overflow-x-auto">
          <table className="w-full border-collapse font-body text-[13.5px] md:text-[15.5px]">
            <thead>
              <tr className="text-left font-typewriter text-[11px] uppercase tracking-[0.16em] text-vn-gold-antique md:text-[12.5px]">
                <th className="border-b-2 border-vn-gold-antique/50 py-3 pr-4">Khâu</th>
                <th className="border-b-2 border-vn-gold-antique/50 py-3 pr-4">AI hỗ trợ</th>
                <th className="border-b-2 border-vn-gold-antique/50 py-3">Con người quyết định & kiểm chứng</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="border-b border-vn-ivory/15 py-3.5 pr-4 font-semibold text-vn-ivory">{r.khau}</td>
                  <td className="border-b border-vn-ivory/15 py-3.5 pr-4 text-vn-ivory/70">{r.ai}</td>
                  <td className="border-b border-vn-ivory/15 py-3.5 text-vn-ivory/90">{r.nguoi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Reveal className="mt-8 text-center">
          <p className="font-typewriter text-[11.5px] tracking-[0.08em] text-vn-ivory/45 md:text-[13px]">
            Nguồn số liệu: Tổng cục Thống kê · World Bank — Nguồn lý luận: Giáo trình CNXHKH (2021),
            Cương lĩnh 2011, Văn kiện Đại hội VI, IX — Ảnh tư liệu: ghi nguồn tại từng màn.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
