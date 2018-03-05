/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import Title from 'components/ui/Title';
import Paginator from 'components/ui/Paginator';

class SearchListComponent extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array,
    total: PropTypes.number,
    page: PropTypes.number,
    limit: PropTypes.number,

    // ACTIONS
    setSearchPage: PropTypes.func
  }

  render() {
    const {
      list, total, page, limit
    } = this.props;

    return (
      <div className="c-search-list">
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

              <div className="highlight" dangerouslySetInnerHTML={{ __html: l.highlight }} />
            </li>
          ))}
        </ul>

        <Paginator
          options={{
            size: total,
            page,
            limit
          }}
          onChange={this.props.setSearchPage}
        />

      </div>
    );
  }
}

export default SearchListComponent;
