/* eslint max-len: 0 */
import { connect } from 'react-redux';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import Title from 'components/ui/Title';
import Paginator from 'components/ui/Paginator';

import { setSearchPage, setSearchUrl } from './actions';

class SearchResults extends React.PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      list: PropTypes.array,
      total: PropTypes.number,
      page: PropTypes.number,
      limit: PropTypes.number,
      term: PropTypes.string,
      loading: PropTypes.bool
    }),
    headerSearch: PropTypes.bool,
    // ACTIONS
    setSearchPage: PropTypes.func,
    setSearchUrl: PropTypes.func
  }

  onChangePage = (page) => {
    this.props.setSearchPage(page);
    this.props.setSearchUrl();
  }

  render() {
    const {
      term, list, total, page, limit, loading
    } = this.props.search;

    const classNames = classnames({
      'c-search-list--header': this.props.headerSearch
    });

    return (
      <div className={`c-search-list ${classNames}`}>
        {term && list.length > 0 &&
          <ul className="search-list">
            {list.map(l => (
              <li
                key={l.id}
                className="search-list-item"
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
        }

        {((!term) || !total) && term.length !== 0 && !loading &&
          <p className="c-search-list--empty">No results</p>
        }

        {!!total && total > limit && !loading && list.length > 0 &&
          <Paginator
            options={{
              size: total,
              page,
              limit
            }}
            onChange={this.onChangePage}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search
});

const mapDispatchToProps = dispatch => ({
  setSearchPage: page => dispatch(setSearchPage(page)),
  setSearchUrl: url => dispatch(setSearchUrl(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
