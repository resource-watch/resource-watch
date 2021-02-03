import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedTable extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    referer: PropTypes.string,
    routes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isLoading: true,
    referer: '',
  };

  state = {
    isLoading: this.props.isLoading,
    tableData: [],
  };

  UNSAFE_componentWillMount() {
    const { routes: { query: { queryURL } } } = this.props;

    if (queryURL) this.loadTableData(queryURL);
  }

  loadTableData(query) {
    fetch(query)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isLoading: false,
          tableData: response.data,
        });
      })
      .catch((error) => { console.error(error); })
      .then(() => { this.setState({ isLoading: false }); });
  }

  render() {
    const { referer } = this.props;
    const {
      isLoading,
      tableData,
    } = this.state;

    const header = tableData && tableData.length > 0 && Object.keys(tableData[0]);
    const isExternal = isLoadedExternally(referer);

    if (isEmpty(tableData)) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <Spinner isLoading className="-light" />
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed>
        <div className="c-embed-table">
          <div className="visualization">
            <Spinner isLoading={isLoading} className="-light" />
            <div className="table-content c-table">
              {tableData
                && (
                <table>
                  <thead>
                    <tr>
                      {header && header.map((val) => (
                        <th
                          key={`header_${val}`}
                        >
                          {val}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(tableData || []).map((row, i) => (
                      <tr
                        key={`row${i}`}
                      >
                        {Object.keys(row).map((column) => (<td key={`td${column}`}>{row[column]}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
            </div>
          </div>
          {isExternal
            && (
            <img
              className="embed-logo"
              height={21}
              width={129}
              src="/static/images/logo-embed.png"
              alt="Resource Watch"
            />
            ) }
        </div>
      </LayoutEmbed>
    );
  }
}

export default LayoutEmbedTable;
