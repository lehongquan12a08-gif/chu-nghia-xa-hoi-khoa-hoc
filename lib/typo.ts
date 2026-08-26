// Từ ghép 2-3 âm tiết trong các TIÊU ĐỀ/CÂU NHẤN — DÍNH CHẶT bằng
// khoảng-trắng-không-ngắt (NBSP) để trình duyệt không bao giờ bẻ đôi
// ("hoạt / động", "sức / mạnh"…). Chỉ dùng cho heading, không dùng cho văn xuôi.
const WORD_PAIRS = [
  'toàn quốc', 'kháng chiến', 'việt bắc', 'thu – đông', 'củng cố', 'phát triển',
  'bước ngoặt', 'ngoại giao', 'chiến dịch', 'biên giới', 'lực lượng', 'mở rộng',
  'hoạt động', 'quân sự', 'tạo thế', 'xây dựng', 'tập đoàn', 'cứ điểm', 'bắt đầu',
  'tích lũy', 'sức mạnh', 'toàn thắng', 'điện biên phủ', 'thế và lực',
];

export function bindPairs(s: string): string {
  let r = s;
  for (const p of WORD_PAIRS) {
    const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    r = r.replace(re, (m) => m.split(' ').join(' '));
  }
  return r;
}
