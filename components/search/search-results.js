/* eslint max-len: 0 */
import { connect } from 'react-redux';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import Title from 'components/ui/Title';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';

import { setSearchPage, setSearchUrl, setSearchTerm } from 'redactions/search';

class SearchResultsComponent extends React.PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      list: PropTypes.array,
      total: PropTypes.number,
      page: PropTypes.number,
      limit: PropTypes.number,
      term: PropTypes.string
    }),
    headerSearch: PropTypes.bool,
    hideSearchInput: PropTypes.bool,
    // ACTIONS
    setSearchPage: PropTypes.func,
    setSearchTerm: PropTypes.func,
    setSearchUrl: PropTypes.func
  }

  onChangePage = (page) => {
    this.props.setSearchPage(page);
    this.props.setSearchUrl();
  }

  onSearch = debounce((term) => {
    this.props.setSearchPage(1);
    this.props.setSearchTerm(term);
    this.props.setSearchUrl();
  }, 500)

  render() {
    const {
      term, list, total, page, limit
    } = this.props.search;

    const classNames = classnames({
      'c-search-list--header': this.props.headerSearch
    });

    return (
      <div className={`c-search-list ${classNames}`}>

        {!this.props.hideSearchInput && <SearchInput
          input={{
            placeholder: 'Search term',
            value: term
          }}
          onSearch={this.onSearch}
        />}

        {term &&
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

        {(!term || !total) &&
          <p>No results</p>
        }

        {!!total && total > limit &&
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
  setSearchUrl: url => dispatch(setSearchUrl(url)),
  setSearchTerm: term => dispatch(setSearchTerm(term))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsComponent);
