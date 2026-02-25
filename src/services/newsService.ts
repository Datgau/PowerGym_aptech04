import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

const FITNESS_DOMAINS = 'menshealth.com,womenshealthmag.com,shape.com,self.com,fitnessmagazine.com,bodybuilding.com,muscle-fitness.com,healthline.com,webmd.com,mayoclinic.org';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

class NewsService {
  private createNewsApiClient() {
    return axios.create({
      baseURL: NEWS_API_BASE_URL,
      params: {
        apiKey: NEWS_API_KEY,
      },
    });
  }

  private createGNewsClient() {
    return axios.create({
      baseURL: GNEWS_BASE_URL,
      params: {
        token: GNEWS_API_KEY,
      },
    });
  }

  // Get English Gym & Health News (Method 1: everything with gym keywords)
  async getEnglishGymNews(): Promise<NewsResponse> {
    try {
      const client = this.createNewsApiClient();
      
      // Try specific gym and fitness keywords
      const gymQueries = [
        'gym OR fitness OR workout OR bodybuilding',
        'health OR wellness OR exercise OR training',
        'muscle OR strength OR cardio OR weightlifting',
        'nutrition OR diet OR protein OR supplements'
      ];

      for (const query of gymQueries) {
        try {
          const response = await client.get('/everything', {
            params: {
              q: query,
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 10,
              domains: FITNESS_DOMAINS,
            },
          });

          if (response.data.articles && response.data.articles.length > 0) {
            return {
              status: response.data.status,
              totalResults: response.data.totalResults,
              articles: response.data.articles.slice(0, 6).map((article: any, index: number) => ({
                id: `en-gym-${article.url}-${index}`,
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                urlToImage: article.urlToImage || '/images/default-news.jpg',
                publishedAt: article.publishedAt,
                source: article.source,
                author: article.author,
              })),
            };
          }
        } catch (queryError) {
          console.warn(`Gym query "${query}" failed, trying next...`);
          continue;
        }
      }

      // If specific domains fail, try without domain restrictions
      const response = await client.get('/everything', {
        params: {
          q: 'gym fitness workout health',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 6,
        },
      });

      return {
        status: response.data.status,
        totalResults: response.data.totalResults,
        articles: response.data.articles.map((article: any, index: number) => ({
          id: `en-gym-general-${article.url}-${index}`,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage || '/images/default-news.jpg',
          publishedAt: article.publishedAt,
          source: article.source,
          author: article.author,
        })),
      };
    } catch (error) {
      console.error('Error fetching English gym news:', error);
      return this.getEnglishHealthHeadlines();
    }
  }

  // Get English Health Headlines (Method 2: top-headlines)
  async getEnglishHealthHeadlines(): Promise<NewsResponse> {
    try {
      const client = this.createNewsApiClient();
      
      // Try health category from major English-speaking countries
      const countries = ['us', 'gb', 'ca', 'au'];
      
      for (const country of countries) {
        try {
          const response = await client.get('/top-headlines', {
            params: {
              country: country,
              category: 'health',
              pageSize: 6,
            },
          });

          if (response.data.articles && response.data.articles.length > 0) {
            // Filter for fitness/gym related content
            const fitnessArticles = response.data.articles.filter((article: any) => {
              const content = `${article.title} ${article.description}`.toLowerCase();
              return content.includes('gym') || 
                     content.includes('fitness') || 
                     content.includes('workout') || 
                     content.includes('exercise') || 
                     content.includes('health') ||
                     content.includes('muscle') ||
                     content.includes('training') ||
                     content.includes('diet') ||
                     content.includes('nutrition');
            }).slice(0, 6);

            if (fitnessArticles.length > 0) {
              return {
                status: response.data.status,
                totalResults: fitnessArticles.length,
                articles: fitnessArticles.map((article: any, index: number) => ({
                  id: `${country}-health-${article.url}-${index}`,
                  title: article.title,
                  description: article.description,
                  content: article.content,
                  url: article.url,
                  urlToImage: article.urlToImage || '/images/default-news.jpg',
                  publishedAt: article.publishedAt,
                  source: article.source,
                  author: article.author,
                })),
              };
            }
          }
        } catch (countryError) {
          console.warn(`Country "${country}" health news failed, trying next...`);
          continue;
        }
      }

      // If no health articles found, try sports category
      const response = await client.get('/top-headlines', {
        params: {
          country: 'us',
          category: 'sports',
          pageSize: 6,
        },
      });
      return {
        status: response.data.status,
        totalResults: response.data.totalResults,
        articles: response.data.articles.map((article: any, index: number) => ({
          id: `us-sports-${article.url}-${index}`,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage || '/images/default-news.jpg',
          publishedAt: article.publishedAt,
          source: article.source,
          author: article.author,
        })),
      };
    } catch (error) {
      console.error('Error fetching English health headlines:', error);
      return this.getEnglishGymNewsFromGNews();
    }
  }

  // GNews API implementation for English gym news
  async getEnglishGymNewsFromGNews(): Promise<NewsResponse> {
    try {
      const client = this.createGNewsClient();
      
      // Try English fitness search terms
      const searchTerms = [
        'gym fitness workout',
        'health wellness exercise', 
        'bodybuilding muscle training',
        'nutrition diet supplements',
        'fitness health'
      ];

      for (const term of searchTerms) {
        try {
          const response = await client.get('/search', {
            params: {
              q: term,
              lang: 'en',
              max: 6,
            },
          });

          if (response.data.articles && response.data.articles.length > 0) {
            return {
              status: 'ok',
              totalResults: response.data.totalArticles,
              articles: response.data.articles.map((article: any, index: number) => ({
                id: `gnews-en-${article.url}-${index}`,
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                urlToImage: article.image || '/images/default-news.jpg',
                publishedAt: article.publishedAt,
                source: {
                  id: null,
                  name: article.source.name,
                },
                author: null,
              })),
            };
          }
        } catch (termError) {
          console.warn(`Search term "${term}" failed, trying next...`);
          continue;
        }
      }

      // If all terms fail, return fallback
      return this.getEnglishFallbackNews();
    } catch (error) {
      console.error('Error fetching English gym news from GNews:', error);
      return this.getEnglishFallbackNews();
    }
  }



  // English fallback mock data (gym, fitness, health topics)
  private getEnglishFallbackNews(): NewsResponse {
    return {
      status: 'ok',
      totalResults: 6,
      articles: [
        {
          id: 'en-fallback-1',
          title: 'The Ultimate Guide to Building Muscle: Science-Based Training Tips',
          description: 'Discover the latest research on muscle building, including optimal rep ranges, progressive overload techniques, and recovery strategies for maximum gains.',
          url: 'https://menshealth.com/ultimate-muscle-building-guide',
          urlToImage: '/images/muscle-building-guide.jpg',
          publishedAt: new Date().toISOString(),
          source: {
            id: 'mens-health',
            name: "Men's Health",
          },
          author: 'Fitness Expert',
        },
        {
          id: 'en-fallback-2',
          title: 'High-Intensity Interval Training: Maximize Your Workout in Minimal Time',
          description: 'Learn how HIIT workouts can boost your metabolism, improve cardiovascular health, and help you achieve your fitness goals faster.',
          url: 'https://shape.com/hiit-workout-benefits',
          urlToImage: '/images/hiit-training.jpg',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          source: {
            id: 'shape',
            name: 'Shape',
          },
          author: 'Certified Trainer',
        },
        {
          id: 'en-fallback-3',
          title: 'Nutrition Timing: When to Eat for Optimal Gym Performance',
          description: 'Understanding pre and post-workout nutrition can significantly impact your training results and recovery time.',
          url: 'https://bodybuilding.com/nutrition-timing-guide',
          urlToImage: '/images/nutrition-timing.jpg',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          source: {
            id: 'bodybuilding',
            name: 'Bodybuilding.com',
          },
          author: 'Sports Nutritionist',
        },
        {
          id: 'en-fallback-4',
          title: 'Mental Health Benefits of Regular Exercise: What Science Says',
          description: 'New research reveals how consistent physical activity can reduce anxiety, improve mood, and boost cognitive function.',
          url: 'https://healthline.com/exercise-mental-health-benefits',
          urlToImage: '/images/exercise-mental-health.jpg',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          source: {
            id: 'healthline',
            name: 'Healthline',
          },
          author: 'Health Researcher',
        },
        {
          id: 'en-fallback-5',
          title: 'Home Gym Setup: Essential Equipment for Effective Workouts',
          description: 'Create an efficient home gym space with these must-have pieces of equipment that deliver maximum versatility and results.',
          url: 'https://self.com/home-gym-equipment-guide',
          urlToImage: '/images/home-gym-setup.jpg',
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          source: {
            id: 'self',
            name: 'SELF',
          },
          author: 'Fitness Equipment Expert',
        },
      ],
    };
  }

  async getNews(): Promise<NewsResponse> {
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your-api-key-here') {
      try {
        const result = await this.getEnglishGymNews();
        if (result.articles.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn('English gym news failed, trying health headlines...');
      }
      try {
        const result = await this.getEnglishHealthHeadlines();
        if (result.articles.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn('English health headlines failed, trying GNews...');
      }
    }
    if (GNEWS_API_KEY && GNEWS_API_KEY !== 'your-gnews-api-key') {
      try {
        const result = await this.getEnglishGymNewsFromGNews();
        if (result.articles.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn('GNews failed, using fallback data...');
      }
    }
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your-api-key-here') {
      try {
        const client = this.createNewsApiClient();
        const response = await client.get('/everything', {
          params: {
            q: 'fitness OR health OR gym',
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 6,
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          },
        });

        if (response.data.articles && response.data.articles.length > 0) {
          return {
            status: response.data.status,
            totalResults: response.data.totalResults,
            articles: response.data.articles.map((article: any, index: number) => ({
              id: `latest-fitness-${article.url}-${index}`,
              title: article.title,
              description: article.description,
              content: article.content,
              url: article.url,
              urlToImage: article.urlToImage || '/images/default-news.jpg',
              publishedAt: article.publishedAt,
              source: article.source,
              author: article.author,
            })),
          };
        }
      } catch (error) {
        console.warn('Last resort fitness news fetch failed:', error);
      }
    }
    console.log('All API methods failed, returning English fitness fallback data');
    return this.getEnglishFallbackNews();
  }
}

export const newsService = new NewsService();