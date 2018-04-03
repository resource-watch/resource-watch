import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import 'isomorphic-fetch';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setEmbed } from 'redactions/common';

// Components
import Page from 'layout/page';
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';

class EmbedTable extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req } = context;

    store.dispatch(setEmbed(true));

    return {
      ...props,
      referer: isServer ? req.headers.referer : window.location.href
    };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: props.isLoading,
      tableData: []
    };
  }

  componentDidMount() {
    const query = this.props.url.query.queryURL;
    if (query) {
      this.loadTableData(query);
    }
  }

  loadTableData(query) {
    fetch(query)
      .then(response => response.json())
      .then((response) => {
        this.setState({
          isLoading: false,
          tableData: response.data
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  render() {
    const { isLoading, tableData } = this.state;

    const header = tableData && tableData.length > 0 && Object.keys(tableData[0]);

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
              {tableData &&
                <table>
                  <thead>
                    <tr>
                      {header && header.map(val => (
                        <th
                          key={`header_${val}`}
                        >
                          {val}
                        </th>
                      ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {tableData && tableData.length && tableData.length > 0 &&
                      tableData.map((row, i) =>
                        (
                          <tr
                            key={`row${i}`} // eslint-disable-line
                          >
                            {
                              Object.keys(row).map(column => (<td key={`td${column}`}>{row[column]}</td>))
                            }
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
          { this.isLoadedExternally() &&
            <img
              className="embed-logo"
              height={21}
              width={129}
              src="/static/images/logo-embed.png"
              alt="Resource Watch"
            /> }
        </div>
      </LayoutEmbed>
    );
  }
}

EmbedTable.propTypes = {
  queryURL: PropTypes.object,
  isLoading: PropTypes.bool
};

EmbedTable.defaultProps = {
  isLoading: true
};

export default withRedux(initStore, null, null)(EmbedTable);
