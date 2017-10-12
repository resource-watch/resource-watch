import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import d3 from 'd3';

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
import VegaChart from 'components/widgets/charts/VegaChart';
import Spinner from 'components/ui/Spinner';
import ChartTheme from 'utils/widgets/theme';
import Icon from 'components/widgets/editor/ui/Icon';

class EmbedWidget extends Page {
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
      modalOpened: false
    };
  }

  componentDidMount() {
    this.props.getWidget(this.props.url.query.id);
  }

  getModal() {
    const { widget, bandDescription, bandStats } = this.props;
    return (
      <div className="widget-modal">
        { !widget.attributes.description && !bandDescription && isEmpty(bandStats) &&
          <p>No additional information is available</p>
        }

        { widget.attributes.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.attributes.description}</p>
          </div>
        ) }

        { bandDescription && (
          <div>
            <h4>Band description</h4>
            <p>{bandDescription}</p>
          </div>
        ) }

        { !isEmpty(bandStats) && (
          <div>
            <h4>Statistical information</h4>
            <div className="c-table">
              <table>
                <thead>
                  <tr>
                    { Object.keys(bandStats).map(name => <th key={name}>{name}</th>) }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    { Object.keys(bandStats).map((name) => {
                      const number = d3.format('.4s')(bandStats[name]);
                      return (
                        <td key={name}>{number}</td>
                      );
                    }) }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) }
      </div>
    );
  }

  render() {
    const { widget, loading } = this.props;
    const { isLoading, modalOpened } = this.state;

    if (loading) {
      return (
        <EmbedLayout
          title={'Loading widget...'}
          description={''}
        >
          <Spinner isLoading className="-light" />
        </EmbedLayout>
      );
    }

    return (
      <EmbedLayout
        title={`${widget.attributes.name}`}
        description={`${widget.attributes.description || ''}`}
      >
        <div className="c-embed-widget">
          <Spinner isLoading={isLoading} className="-light" />
          <div className="widget-title">
            <a href={`/data/explore/${widget.attributes.dataset}`} target="_blank" rel="noopener noreferrer">
              <h4>{widget.attributes.name}</h4>
            </a>
            <button
              aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
              onClick={() => this.setState({ modalOpened: !modalOpened })}
            >
              <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
            </button>
          </div>
          <div className="widget-content">
            <VegaChart
              data={widget.attributes.widgetConfig}
              theme={ChartTheme()}
              toggleLoading={l => this.setState({ isLoading: l })}
              reloadOnResize
            />
            { modalOpened && this.getModal() }
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src={'/static/images/logo-embed.png'}
                  alt="Resource Watch"
                />
              </a>
            </div>
          ) }
        </div>
      </EmbedLayout>
    );
  }
}

EmbedWidget.propTypes = {
  widget: PropTypes.object,
  getWidget: PropTypes.func,
  bandDescription: PropTypes.string,
  bandStats: PropTypes.object,
  loading: PropTypes.bool
};

EmbedWidget.defaultProps = {
  widget: {}
};

const mapStateToProps = state => ({
  widget: state.widget.data,
  loading: state.widget.loading,
  bandDescription: state.widget.bandDescription,
  bandStats: state.widget.bandStats
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedWidget);
