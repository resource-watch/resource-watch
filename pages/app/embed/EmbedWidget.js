import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

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
import VegaChart from 'components/widgets/VegaChart';
import Spinner from 'components/ui/Spinner';
import ChartTheme from 'utils/widgets/theme';

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
      isLoading: props.isLoading
    };
  }

  componentDidMount() {
    this.props.getWidget(this.props.url.query.id);
  }

  render() {
    const { widget } = this.props;
    const { isLoading } = this.state;

    if (isEmpty(widget)) {
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
          <div className="visualization">
            <Spinner isLoading={isLoading} className="-light" />
            <div className="widget-title">
              <h4>{widget.attributes.name}</h4>
            </div>
            <div className="widget-content">
              <VegaChart
                height={300}
                data={widget.attributes.widgetConfig}
                theme={ChartTheme()}
                toggleLoading={isLoading => this.setState({ isLoading })}
                reloadOnResize
              />
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

EmbedWidget.propTypes = {
  widget: PropTypes.object,
  isLoading: PropTypes.bool,
  getWidget: PropTypes.func
};

EmbedWidget.defaultProps = {
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedWidget);
