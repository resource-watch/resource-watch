/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import Title from 'components/ui/Title';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';

class SearchListComponent extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array,
    total: PropTypes.number,
    page: PropTypes.number,
    limit: PropTypes.number,
    term: PropTypes.string,

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
    } = this.props;

    return (
      <div className="c-search-list">
        <SearchInput
          input={{
            placeholder: 'Search term',
            value: term
          }}
          escapeText
          onSearch={this.onSearch}
        />

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

        {!!total &&
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

export default SearchListComponent;
