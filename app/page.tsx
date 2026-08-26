import Navbar from '@/components/Navbar';
import TimelineIndicator from '@/components/TimelineIndicator';
import AutoScrollButton from '@/components/AutoScrollButton';
import AudioController from '@/components/AudioController';
import Hero from '@/components/Hero';
import WordCascade from '@/components/WordCascade';
import DateReveal from '@/components/DateReveal';
import SlideSection from '@/components/SlideSection';
import MilestoneChapter from '@/components/MilestoneChapter';
import NgaBa from '@/components/NgaBa';
import TimeSlider from '@/components/TimeSlider';
import ProgressBars8 from '@/components/ProgressBars8';
import GiaiTrinhAI from '@/components/GiaiTrinhAI';
import Footer from '@/components/Footer';
import { MILESTONES } from '@/data/milestones';

/**
 * TỪ TEM PHIẾU ĐẾN MÃ QR — MLN131 · Chương 3: Thời kỳ quá độ lên CNXH ở VN.
 * Mạch trinh thám 4 hồi, KHÔNG câu hỏi tương tác, KHÔNG phần tổng kết (giống
 * web Hành trình theo chân Bác): Cơn đói sau ngày thắng → Tấm bản đồ của Mác →
 * Ngã ba và khúc quanh → Chương đang viết. Lồng tiếng lắp sau (data/narration).
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <TimelineIndicator />
      <AutoScrollButton />
      <AudioController />

      <main>
        {/* ═══ MỞ ĐẦU ═══ */}
        <Hero />
        {/* Câu hỏi trinh thám dẫn toàn bài */}
        <WordCascade
          eyebrow="1975 – 1985"
          words={['THẮNG HAI ĐẾ QUỐC', 'NHƯNG THIẾU GẠO ĂN', 'VÌ SAO?']}
          accentWords={['VÌ SAO?']}
          perWordVh={70}
        />

        {/* ═══ HỒI 1: CƠN ĐÓI SAU NGÀY THẮNG (sepia) ═══ */}
        <div className="era-cu">
        <SlideSection
          id="ch-baocap"
          eyebrow="Hồi 1 · Cơn đói sau ngày thắng"
          title="1975 – 1985 — Đêm trước Đổi mới"
          groups={[
            {
              bullets: [
                'Đất nước bước ra khỏi chiến tranh với nền nông nghiệp lạc hậu, bị tàn phá nặng nề, lại bị bao vây cấm vận.',
                'Cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp: mua bán bằng tem phiếu, xếp hàng trước cửa hàng mậu dịch.',
                'Sản xuất đình đốn, lưu thông ách tắc — khủng hoảng kinh tế – xã hội kéo dài.',
                'Một đất nước vừa làm nên toàn thắng lịch sử lại phải lo từng bữa gạo.',
              ],
            },
          ]}
          images={[
            { src: '/images/csk/baocap-xephang.svg', caption: 'Xếp hàng trước cửa hàng mậu dịch quốc doanh (ô chờ ảnh tư liệu — nguồn TTXVN)' },
            { src: '/images/csk/baocap-sogao.svg', fit: 'contain', caption: 'Sổ gạo, tem phiếu thời bao cấp (ô chờ ảnh tư liệu)' },
          ]}
        />
        </div>
        {/* Đỉnh khủng hoảng — con số duy nhất cần nhớ của hồi 1 */}
        <DateReveal
          id="ch-774"
          parts={['774,7%']}
          heading="LẠM PHÁT NĂM 1986"
          lines={[
            { text: 'Giá cả tăng từng ngày. Đồng lương không theo kịp.' },
            { text: 'Đổi mới trở thành đòi hỏi sống còn.', accent: true },
          ]}
          background="radial-gradient(ellipse at 50% 42%, #2a1c0c 0%, #14100a 70%)"
        />

        {/* ═══ HỒI 2: TẤM BẢN ĐỒ CỦA MÁC ═══ */}
        <WordCascade
          eyebrow="Hồi 2 · Lý luận"
          words={['MUỐN HIỂU VÌ SAO', 'PHẢI MỞ TẤM BẢN ĐỒ']}
          perWordVh={70}
        />
        <div className="era-cu">
        <SlideSection
          id="ch-bando"
          eyebrow="Hồi 2 · Tấm bản đồ của Mác"
          groups={[
            {
              title: 'Chủ nghĩa xã hội là gì?',
              bullets: [
                'Là giai đoạn ĐẦU của hình thái kinh tế – xã hội cộng sản chủ nghĩa.',
                'Ra đời từ mâu thuẫn giữa lực lượng sản xuất xã hội hóa cao với quan hệ sản xuất tư bản chủ nghĩa dựa trên chiếm hữu tư nhân.',
                'Gắn liền với sứ mệnh lịch sử của giai cấp công nhân, thông qua cách mạng vô sản.',
              ],
            },
          ]}
          images={[
            { src: '/images/csk/bando-mac.svg', caption: 'C. Mác — người vẽ tấm bản đồ lý luận (ô chờ ảnh tư liệu)' },
          ]}
        />
        </div>
        <SlideSection
          id="ch-dactrung6"
          eyebrow="Hồi 2 · Tấm bản đồ của Mác"
          background="radial-gradient(ellipse at 50% 40%, #1c150c 0%, #14100a 72%)"
          groups={[
            {
              title: '6 đặc trưng bản chất của chủ nghĩa xã hội',
              bullets: [
                'Giải phóng giai cấp, giải phóng dân tộc, giải phóng xã hội, giải phóng con người — tạo điều kiện để con người phát triển toàn diện.',
                'Do nhân dân lao động làm chủ.',
                'Có nền kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và chế độ công hữu về tư liệu sản xuất chủ yếu.',
                'Có nhà nước kiểu mới mang bản chất giai cấp công nhân, đại biểu cho lợi ích, quyền lực và ý chí của nhân dân lao động.',
                'Có nền văn hóa phát triển cao, kế thừa và phát huy giá trị văn hóa dân tộc và tinh hoa văn hóa nhân loại.',
                'Bảo đảm bình đẳng, đoàn kết giữa các dân tộc; có quan hệ hữu nghị, hợp tác với nhân dân các nước.',
              ],
            },
          ]}
        />
        <SlideSection
          id="ch-quado"
          eyebrow="Hồi 2 · Tấm bản đồ của Mác"
          background="radial-gradient(ellipse at 50% 40%, #1c150c 0%, #14100a 72%)"
          groups={[
            {
              title: 'Thời kỳ quá độ — cái cũ và cái mới đan xen',
              bullets: [
                'Kinh tế: tất yếu tồn tại nền kinh tế NHIỀU thành phần, trong đó có những thành phần đối lập.',
                'Chính trị: thiết lập, tăng cường chuyên chính vô sản — nhân dân lao động từng bước làm chủ.',
                'Tư tưởng – văn hóa: còn tồn tại nhiều tư tưởng khác nhau, chủ yếu là tư tưởng vô sản và tư tưởng tư sản.',
                'Xã hội: còn nhiều giai cấp, tầng lớp; còn khác biệt thành thị – nông thôn, lao động trí óc – chân tay.',
              ],
            },
          ]}
        />

        {/* ═══ HỒI 3: NGÃ BA VÀ KHÚC QUANH ═══ */}
        <NgaBa id="ch-ngaba" />
        <SlideSection
          id="ch-boqua"
          eyebrow="Hồi 3 · Làm rõ nội hàm"
          title='"Bỏ qua" — không phải đốt cháy giai đoạn'
          background="radial-gradient(ellipse at 50% 40%, #1c150c 0%, #14100a 72%)"
          groups={[
            {
              title: 'Bỏ qua điều gì?',
              bullets: [
                'Bỏ qua việc xác lập vị trí THỐNG TRỊ của quan hệ sản xuất và kiến trúc thượng tầng tư bản chủ nghĩa.',
              ],
            },
            {
              title: 'Kế thừa điều gì?',
              bullets: [
                'Tiếp thu, kế thừa những thành tựu mà nhân loại đã đạt được dưới chủ nghĩa tư bản — đặc biệt về khoa học và công nghệ — để phát triển nhanh lực lượng sản xuất, xây dựng nền kinh tế hiện đại. (Văn kiện Đại hội IX)',
              ],
              accent: true,
            },
          ]}
        />
        {/* CAO TRÀO: Đại hội VI — từ màn này màu bắt đầu tràn vào */}
        <MilestoneChapter milestone={MILESTONES.doiMoi} />

        {/* ═══ HỒI 4: CHƯƠNG ĐANG VIẾT (có màu) ═══ */}
        <TimeSlider id="ch-keoman" />
        <SlideSection
          id="ch-homnay"
          eyebrow="Hồi 4 · Chương đang viết"
          title="Gần 40 năm Đổi mới"
          background="linear-gradient(180deg, #14100a 0%, #10201d 55%, #14100a 100%)"
          groups={[
            {
              bullets: [
                'GDP: từ khoảng 14 tỷ USD (1985) lên khoảng 430 tỷ USD (2023) — nguồn: World Bank.',
                'Tỷ lệ nghèo: từ 58% (1993) xuống dưới 3% — nguồn: Tổng cục Thống kê / World Bank.',
                'Kim ngạch xuất nhập khẩu vượt 730 tỷ USD (2022) — nguồn: Tổng cục Thống kê.',
                'Từ nước thiếu lương thực trở thành một trong những nước xuất khẩu gạo hàng đầu thế giới.',
              ],
            },
            {
              bullets: [
                'Kinh tế thị trường định hướng xã hội chủ nghĩa — sự vận dụng sáng tạo lý luận quá độ vào điều kiện Việt Nam.',
              ],
              accent: true,
            },
          ]}
          images={[
            { src: '/images/csk/homnay-1.svg', caption: 'Thành phố hôm nay (ô chờ ảnh — nhóm tự chụp)' },
            { src: '/images/csk/homnay-2.svg', caption: 'Mã QR ở quán vỉa hè (ô chờ ảnh — nhóm tự chụp)' },
          ]}
        />
        {/* 8 thanh tiến độ dang dở — hình ảnh hóa chữ "quá độ" */}
        <ProgressBars8 id="ch-2011" />
        {/* Kết — thay phần tổng kết bằng chữ lướt */}
        <WordCascade
          id="ch-chuongcuoi"
          eyebrow="Thời kỳ quá độ — nghĩa là chưa kết thúc"
          words={['CHƯƠNG CUỐI', 'DO CHÚNG TA VIẾT']}
          accentWords={['DO CHÚNG TA VIẾT']}
          perWordVh={80}
        />

        {/* Giải trình AI (bắt buộc của assignment) + Ending */}
        <GiaiTrinhAI id="giai-trinh-ai" />
        <Footer />
      </main>
    </>
  );
}
