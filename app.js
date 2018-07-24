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

/* View */
// DOM elements
const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.searchNews'),
  searchResList: document.querySelector('.result-news'),
  searchRes: document.querySelector('.top-news'),
  loadMore: document.querySelector('.load-more'),
  div: document.createElement('div'),
  sideMenu: document.querySelector('#side-menu')
};

// ClassNames
const elementsString = {
  loader: 'loader',
  alert: 'alert alert-user',
  error: 'alert error',
  button: 'btn-load-more'
};

const checkErrors = (message, status, totalResults) => {
  if (status === 'ok' && totalResults === 0) {
    showAlert(message, elementsString.alert);
  } else if (status === 'error') {
    showAlert(message, elementsString.error);
  };
};

const showAlert = (message, className) => {
  clearAlert();
  elements.div.className = className;
  elements.div.appendChild(document.createTextNode(message));
  elements.searchRes.insertBefore(elements.div, elements.searchResList);

  // Alert Disapear after 3 seconds
  setTimeout(() => {
    clearAlert();
  }, 3000);

};

const clearAlert = () => {
  const currentAlert = document.querySelector('.alert');

  if (currentAlert) {
    currentAlert.innerHTML = '';
    currentAlert.remove();
  };
};

const renderButton = () => {
  if (globalChoice === 'main') {
    const button = `
    <button class="${elementsString.button}" onclick="${state.search.loadMore('main')}">Load More</button>
  `;
  } else {
    const button = `
    <button class="${elementsString.button}" onclick="${state.mainNews.loadMore('search')}">Load More</button>
  `;
  }
  elements.loadMore.insertAdjacentHTML('afterbegin', button);
};

const clearButton = () => {
  const loadButton = document.querySelector(`${elementsString.button}`);
  if (loadButton) loadButton.parentElement.removeChild(loadButton);
};
// rendering the spiner in the midel of the page
const renderLoader = parent => {
  const loader = `
    <div class="${elementsString.loader}">
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

const clearLoader = () => {
  const loader = document.querySelector(`.${elementsString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
// Gets query value from the input field
const getInput = () => elements.searchInput.value;

const clearInput = () => {
  elements.searchInput.value = '';
};

const clearResults = () => {
  elements.searchResList.innerHTML = '';
};
// Creating the DOM elements and inserting in the Ascending order
const renderArticle = article => {
  let output = '';

  if (article.author === null) {
    output = `
    <p> 
      <a href="${article.url}" target="_blank">${article.title}</a>
    </p>
  `;
  } else {
    output = `
    <p> 
      <a href="${article.url}" target="_blank">${article.title}</a>
      <small class="source">(${article.author})
      </small>
    </p>
  `;
  };
  elements.searchResList.insertAdjacentHTML('beforeend', output);
};
// Renders articels from the articels array
const renderResults = articles => {
  articles.forEach(article => renderArticle(article));
};