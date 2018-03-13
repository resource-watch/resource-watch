import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Spinner from 'components/ui/Spinner';
import LayoutEmbed from 'layout/layout/layout-embed';
import Page from 'layout/page';
import { setEmbed } from 'redactions/common';

// Widget editor
import { VegaChart, getVegaTheme } from 'widget-editor';

// Services
import DatasetService from 'services/DatasetService';

class EmbedDataset extends Page {
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
      dataset: null,
      loadingWidget: true,
      loadingDataset: true
    };

    // DatasetService
    this.datasetService = new DatasetService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });

    // ---------------------- Bindings --------------------------
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
    // ----------------------------------------------------------
  }

  componentDidMount() {
    this.datasetService.fetchData('widget, metadata').then((data) => {
      this.setState({
        dataset: data,
        loadingDataset: false
      });
    });
  }

  triggerToggleLoading() {
    this.setState({ loadingWidget: false });
  }

  render() {
    const { dataset, loadingDataset, loadingWidget } = this.state;
    const widgets = dataset && dataset.attributes.widget;
    const metadataObj = dataset && dataset.attributes.metadata[0];
    const datasetName = metadataObj && metadataObj.attributes.info ?
      metadataObj.attributes.info.name : dataset && dataset.attributes.name;
    const datasetDescription = metadataObj && metadataObj.attributes ?
      metadataObj.attributes.description : dataset && dataset.attributes.description;
    let widget = null;

    if (widgets) {
      widget = widgets.find(value => value.attributes.default === true);
    }

    if (loadingDataset) {
      return (
        <LayoutEmbed
          title="Loading dataset..."
          description=""
        >
          <div className="c-embed-widget">
            <Spinner isLoading className="-light" />
          </div>
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed
        title={datasetName}
        description={datasetDescription}
      >
        <div className="c-embed-dataset">
          {widget &&
            <div className="widget-content">
              <VegaChart
                data={widget.attributes.widgetConfig}
                theme={getVegaTheme()}
                toggleLoading={this.triggerToggleLoading}
                reloadOnResize
              />
            </div>
          }
          <Spinner isLoading={loadingWidget} className="-light -relative" />
          <div className="info">
            <div className="widget-title">
              <h2>
                <Link
                  route="explore_detail"
                  params={{ id: dataset.id }}
                >
                  <a>{datasetName}</a>
                </Link>
              </h2>
            </div>
            <div className="widget-description">
              {datasetDescription}
            </div>
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              Powered by
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          ) }
        </div>
      </LayoutEmbed>
    );
  }
}

EmbedDataset.propTypes = {
  url: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale
});

export default withRedux(initStore, mapStateToProps, null)(EmbedDataset);
