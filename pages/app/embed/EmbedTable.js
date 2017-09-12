import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import 'isomorphic-fetch';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget } from 'redactions/widget';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Components
import Page from 'components/app/layout/Page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import Spinner from 'components/ui/Spinner';

class EmbedTable extends Page {
  static getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const referer = isServer ? req.headers.referer : location.href;
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url, referer, isLoading: true };
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
    this.props.getWidget(this.props.url.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.widget && nextProps.widget.attributes) {
      const queryURL = nextProps.widget.attributes.widgetConfig.data[0].url;
      this.loadTableData(queryURL);
    }
  }

  loadTableData(query) {
    fetch(query)
      .then((response) => {
        this.setState({
          isLoading: false,
          tableData: response
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  render() {
    const { widget } = this.props;
    const { isLoading, tableData } = this.state;

    const header = tableData && tableData.length > 0 && Object.keys(tableData[0]);

    if (isEmpty(tableData)) {
      return (
        <EmbedLayout
          title={'Loading widget...'}
          description={''}
        >
          <Spinner isLoading className="-light" />
        </EmbedLayout>
      );
    }
    debugger;
    console.log('tableData', tableData);

    return (
      <EmbedLayout
        title={`${widget.attributes.name}`}
        description={`${widget.attributes.description || ''}`}
      >
        <div className="c-embed-widget">
          <div className="visualization">
            <Spinner isLoading={isLoading} className="-light" />
            <div className="widget-title">
              <h4>{widget.attributes.name}</h4>
            </div>
            <div className="widget-content">
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
                        )
                      )
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
              src={'/static/images/logo-embed.png'}
              alt="Resource Watch"
            /> }
        </div>
      </EmbedLayout>
    );
  }
}

EmbedTable.propTypes = {
  widget: PropTypes.object,
  isLoading: PropTypes.bool,
  getWidget: PropTypes.func
};

EmbedTable.defaultProps = {
  widget: {},
  isLoading: true
};

const mapStateToProps = state => ({
  widget: state.widget.data,
  isLoading: state.widget.loading
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedTable);
