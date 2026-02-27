import React from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import styles from './PowerGymPages.module.css';

const News: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: 'PowerGym Opens New Branch in District 7',
      date: '15/01/2024',
      excerpt: 'With an area of 1000m2 and the most modern equipment, the new branch promises to bring a great training experience.',
      image: '🏢'
    },
    {
      id: 2,
      title: 'Effective Weight Loss Program in 30 Days',
      date: '12/01/2024',
      excerpt: 'Join a scientific weight loss program with guidance from a team of professional PTs.',
      image: '💪'
    },
    {
      id: 3,
      title: 'Free Yoga Workshop on Weekends',
      date: '10/01/2024',
      excerpt: 'Join free Yoga workshops every weekend to relax and improve mental health.',
      image: '🧘'
    },
    {
      id: 4,
      title: 'PowerGym Championship 2024 Powerlifting Competition',
      date: '08/01/2024',
      excerpt: 'Register for the biggest Powerlifting competition of the year with total prizes up to 100 million VND.',
      image: '🏆'
    }
  ];


  // test remote
  return (
    <PowerGymLayout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1>PowerGym News</h1>
          <p>Latest updates from PowerGym</p>
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