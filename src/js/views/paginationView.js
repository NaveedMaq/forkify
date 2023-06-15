import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // FIRST AND OTHER
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage + 1, 'next');
    }

    // LAST PAGE
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage - 1, 'prev');
    }

    // OTHER PAGE
    if (curPage < numPages) {
      return (
        this._generateMarkupButton(curPage - 1, 'prev') +
        this._generateMarkupButton(curPage + 1, 'next')
      );
    }

    // FIRST PAGE ONLY
    return '';
  }

  _generateMarkupButton(page, arrowDirection) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--${arrowDirection}">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      arrowDirection === 'prev' ? 'left' : 'right'
    }"></use>
        </svg>
        <span>Page ${page}</span>
    </button>
  `;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
