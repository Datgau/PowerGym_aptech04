import React from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import styles from './PowerGymPages.module.css';

const News: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: 'PowerGym khai trương chi nhánh mới tại Quận 7',
      date: '15/01/2024',
      excerpt: 'Với diện tích 1000m2 và trang thiết bị hiện đại nhất, chi nhánh mới hứa hẹn mang đến trải nghiệm tập luyện tuyệt vời.',
      image: '🏢'
    },
    {
      id: 2,
      title: 'Chương trình giảm cân hiệu quả trong 30 ngày',
      date: '12/01/2024',
      excerpt: 'Tham gia chương trình giảm cân khoa học với sự hướng dẫn của đội ngũ PT chuyên nghiệp.',
      image: '💪'
    },
    {
      id: 3,
      title: 'Workshop Yoga miễn phí cuối tuần',
      date: '10/01/2024',
      excerpt: 'Tham gia workshop Yoga miễn phí mỗi cuối tuần để thư giãn và tăng cường sức khỏe tinh thần.',
      image: '🧘'
    },
    {
      id: 4,
      title: 'Giải đấu Powerlifting PowerGym Championship 2024',
      date: '08/01/2024',
      excerpt: 'Đăng ký tham gia giải đấu Powerlifting lớn nhất năm với tổng giải thưởng lên đến 100 triệu đồng.',
      image: '🏆'
    }
  ];


  // test remote
  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>Tin tức PowerGym</h1>
          <p>Cập nhật những thông tin mới nhất từ PowerGym</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.newsGrid}>
            {newsItems.map((news) => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImage}>
                  {news.image}
                </div>
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{news.title}</h3>
                  <p className={styles.newsDate}>{news.date}</p>
                  <p className={styles.newsExcerpt}>{news.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PowerGymLayout>
  );
};

export default News;