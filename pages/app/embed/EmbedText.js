import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget } from 'redactions/widget';
import { setEmbed } from 'redactions/common';

// Components
import Page from 'layout/page';
import LayoutEmbed from 'layout/layout/layout-embed';
import TextChart from 'components/widgets/charts/TextChart';
import Spinner from 'components/ui/Spinner';

class EmbedText extends Page {
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
      isLoading: props.isLoading
    };
  }

  componentDidMount() {
    this.props.getWidget(this.props.url.query.id);
  }

  render() {
    const { widget, loading } = this.props;
    const { isLoading } = this.state;

    if (loading) {
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
      <LayoutEmbed
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
              <TextChart
                widgetConfig={widget.attributes.widgetConfig}
                toggleLoading={l => this.setState({ isLoading: l })}
              />
            </div>
            <p className="widget-description">
              {widget.attributes.description}
            </p>
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

EmbedText.propTypes = {
  widget: PropTypes.object,
  getWidget: PropTypes.func,
  bandDescription: PropTypes.string,
  bandStats: PropTypes.object,
  loading: PropTypes.bool
};

EmbedText.defaultProps = {
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedText);
