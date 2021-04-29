import { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import Title from 'components/ui/Title';
import Paginator from 'components/ui/Paginator';

// styles
import './styles.scss';

class SearchResults extends PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      list: PropTypes.array,
      total: PropTypes.number,
      page: PropTypes.number,
      limit: PropTypes.number,
      term: PropTypes.string,
      loading: PropTypes.bool,
      selected: PropTypes.number,
    }).isRequired,
    headerSearch: PropTypes.bool,
    setSearchPage: PropTypes.func.isRequired,
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = { headerSearch: false }

  onChangePage = (page) => {
    const {
      setSearchPage,
      search: {
        term,
      },
      router,
    } = this.props;

    setSearchPage(page);
    router.replace(
      {
        pathname: 'search',
        query: {
          term,
          page,
        },
      },
      `/search?term=${term}&page=${page}`,
      {
        shallow: true,
      },
    );
  }

  render() {
    const {
      search: {
        term, list, total, page, limit, loading, selected,
      },
      headerSearch,
    } = this.props;
    const searchListClass = classnames(
      'c-search-list',
      { 'c-search-list--header': headerSearch },
    );
    const showPagination = !!total && total > limit && !loading && list.length > 0;
    const noResults = ((!term) || !total) && term.length !== 0 && !loading;

    return (
      <div className={searchListClass}>
        {term && list.length > 0
          && (
          <ul className="search-list">
            {list.map((l, k) => (
              <li
                key={l.id}
                className={`search-list-item ${k === (selected - 1) ? 'search-list-item--selected' : null}`}
              >
                <Title className="-default">
                  <a href={l.url}>
                    {l.title}
                  </a>
                </Title>

                <div
                  className="highlight"
                  dangerouslySetInnerHTML={{ __html: l.highlight }}
                />
              </li>
            ))}
          </ul>
          )}

        {noResults && (<p className="c-search-list--empty">No results</p>)}

        {!headerSearch && showPagination
          && (
          <Paginator
            options={{
              size: total,
              page,
              limit,
            }}
            onChange={this.onChangePage}
          />
          )}
      </div>
    );
  }
}

export default withRouter(SearchResults);
