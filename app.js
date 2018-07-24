/* Model */
class Search {
  constructor(query) {
    this.query = query;
    this.articles = [];
    this.pageSize = 30;
    this.totalPages;
    this.page;
  }

  async getResults(choice = 'main') {
    const apiKey = 'f7e2725215d44c1993e874ba74f2a5b3';

    if (choice === 'search') {
      try {
        this.page = 1;
        const response = await fetch(`https://newsapi.org/v2/everything?sources=hacker-news&pageSize=${this.pageSize}&page=${this.page}&q=${this.query}&apiKey=${apiKey}`);
        const resNews = await response.json();
        this.articles = resNews.articles;
        checkErrors(`I didn't found any article that match your search: ${this.query}.`, resNews.status, resNews.totalResults);
      } catch (error) {
        showAlert(error, elementsString.error);
      };
    } else if (choice === 'main') {
      try {
        this.page = 1;
        const response = await fetch(`https://newsapi.org/v2/everything?sources=hacker-news&pageSize=${this.pageSize}&page=${this.page}&apiKey=${apiKey}`);
        const resNews = await response.json();
        this.articles = resNews.articles;
        checkErrors('No articels have been found, check again later', resNews.status, resNews.totalResults);
      } catch (error) {
        showAlert(error, elementsString.error);
      };
    } else {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=hacker-news&apiKey=${apiKey}`);
        const resNews = await response.json();
        this.articles = resNews.articles;
        checkErrors('In this point there are no top articles', resNews.status, resNews.totalResults);
      } catch (error) {
        showAlert(error, elementsString.error);
      };
    };
  };
};