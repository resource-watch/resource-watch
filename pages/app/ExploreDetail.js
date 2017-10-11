/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import MediaQuery from 'react-responsive';
import { toastr } from 'react-redux-toastr';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { resetDataset } from 'redactions/exploreDetail';
import { toggleModal, setModalOptions } from 'redactions/modal';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';
import {
  setFilters,
  setColor,
  setCategory,
  setValue,
  setSize,
  setOrderBy,
  setAggregateFunction,
  setLimit,
  setChartType,
  setBand,
  setVisualizationType,
  setLayer,
  setTitle
} from 'components/widgets/editor/redux/widgetEditor';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Next
import { Link } from 'routes';

// Services
import DatasetService from 'services/DatasetService';
import LayersService from 'services/LayersService';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/editor/WidgetEditor';
import ShareExploreDetailModal from 'components/modal/ShareExploreDetailModal';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import DatasetList from 'components/app/explore/DatasetList';
import Banner from 'components/app/common/Banner';

// constants
const LIMIT_CHAR_DESCRIPTION = 1120;

class ExploreDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url };
  }

  constructor(props) {
    super(props);

    this.state = {
      similarDatasetsLoaded: false,
      similarDatasets: [],
      dataset: null,
      loading: false,
      showDescription: false,
      showFunction: false,
      showCautions: false
    };

    // DatasetService
    this.datasetService = new DatasetService(props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  /**
   * Component Lifecycle
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    this.getDataset();
    this.getSimilarDatasets();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      this.props.resetDataset();
      this.setState({
        similarDatasetsLoaded: false,
        datasetLoaded: false
      }, () => {
        this.datasetService = new DatasetService(nextProps.url.query.id, {
          apiURL: process.env.WRI_API_URL
        });
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        this.getDataset();
        this.getSimilarDatasets();
      });
    }
  }

  componentWillUnmount() {
    this.props.resetDataset();
  }

  /**
   * HELPERS
   * - getDataset
   * - getSimilarDatasets
  */
  getDataset() {
    this.setState({
      loading: true
    }, () => {
      this.datasetService.fetchData('layer,metadata,vocabulary,widget').then((response) => {
        const defaultEditableWidget = response.attributes.widget.find(widget => widget.attributes.defaultEditableWidget === true);
        this.setState({
          dataset: response,
          datasetLoaded: true,
          loading: false
        }, () => defaultEditableWidget && this.loadDefaultWidgetIntoRedux(defaultEditableWidget));
      }).catch((error) => {
        toastr.error('Error', 'Unable to load the dataset');
        console.error(error);
        this.setState({
          loading: false
        });
      });
    });
  }

  getSimilarDatasets() {
    this.setState({
      similarDatasetsLoaded: false
    });
    this.datasetService.getSimilarDatasets()
      .then((response) => {
        let counter = 0;
        const similarDatasets = response.map(val => val.dataset).filter(
          () => {
            counter++;
            return counter < 7;
          });

        if (similarDatasets.length > 0) {
          DatasetService.getDatasets(similarDatasets, 'widget,metadata,layer')
            .then((data) => {
              this.setState({
                similarDatasetsLoaded: true,
                similarDatasets: data
              });
            })
            .catch(err => toastr.error('Error', err));
        } else {
          this.setState({
            similarDatasetsLoaded: true,
            similarDatasets: []
          });
        }
      })
      .catch(err => toastr.error('Error', err));
  }

  loadDefaultWidgetIntoRedux(defaultEditableWidget) {
    const { paramsConfig } = defaultEditableWidget.attributes.widgetConfig;
    const { name } = defaultEditableWidget.attributes;
    if (paramsConfig) {
      const {
        visualizationType,
        band,
        value,
        category,
        color,
        size,
        aggregateFunction,
        orderBy,
        filters,
        limit,
        chartType,
        layer
      } = paramsConfig;

      // We restore the type of visualization
      // We default to "chart" to maintain the compatibility with previously created
      // widgets (at that time, only "chart" widgets could be created)
      this.props.setVisualizationType(visualizationType || 'chart');

      if (band) this.props.setBand(band);
      if (layer) this.props.setLayer(layer);
      if (aggregateFunction) this.props.setAggregateFunction(aggregateFunction);
      if (value) this.props.setValue(value);
      if (size) this.props.setSize(size);
      if (color) this.props.setColor(color);
      if (orderBy) this.props.setOrderBy(orderBy);
      if (category) this.props.setCategory(category);
      if (filters) this.props.setFilters(filters);
      if (limit) this.props.setLimit(limit);
      if (chartType) this.props.setChartType(chartType);
      if (name) this.props.setTitle(name);
    }
  }

  /**
   * UI EVENTS
   * - handleShare
   * - handleSubscribe
  */
  @Autobind
  handleShare() {
    const { dataset } = this.state;
    const widgets = dataset && dataset.attributes.widget;
    let widget = null;
    if (widgets) {
      widget = widgets.find(value => value.attributes.default === true);
    }
    const options = {
      children: ShareExploreDetailModal,
      childrenProps: {
        url: window.location.href,
        datasetId: this.state.dataset.id,
        showEmbed: widget && widget.attributes !== null,
        toggleModal: this.props.toggleModal
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }
  @Autobind
  handleSubscribe() {
    const options = {
      children: SubscribeToDatasetModal,
      childrenProps: {
        toggleModal: this.props.toggleModal,
        dataset: this.state.dataset,
        showDatasetSelector: false
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  shortenerText(text = '', fieldToManage, limitChar = 0) {
    const localText = text || '';
    if ((localText || '').length <= limitChar) {
      return localText;
    }

    const fieldVisibility = this.state[fieldToManage] || false;
    const initialText = localText.substr(0, limitChar);
    const leftText = localText.substr(limitChar, localText.length - initialText.length);

    return (
      <div className="shortened-text">
        <span>{initialText}</span>
        {!fieldVisibility && <span>...</span>}
        {!fieldVisibility && <button
          className="read-more"
          onClick={() => this.setState({ [fieldToManage]: true })}
        >
          Read more
        </button>}
        {fieldVisibility &&
          <span>{leftText}</span>}
        {fieldVisibility && <button
          className="read-more -less"
          onClick={() => this.setState({ [fieldToManage]: false })}
        >
          Read less
        </button>}
      </div>
    );
  }

  render() {
    const { dataset, loading, similarDatasets, similarDatasetsLoaded } = this.state;
    const metadataObj = dataset && dataset.attributes.metadata;
    const metadata = metadataObj && metadataObj.length > 0 && metadataObj[0];
    const metadataAttributes = (metadata && metadata.attributes) || {};
    const metadataInfo = (metadataAttributes && metadataAttributes.info) || {};
    const { description } = metadataAttributes;
    const { functions, cautions } = metadataInfo;

    const formattedDescription = this.shortenerText(description, 'showDescription', LIMIT_CHAR_DESCRIPTION);
    const formattedFunctions = this.shortenerText(functions, 'showFunction', LIMIT_CHAR_DESCRIPTION);
    const formattedCautions = this.shortenerText(cautions, 'showCautions', LIMIT_CHAR_DESCRIPTION);

    return (
      <Layout
        title={metadataInfo && metadataInfo.name ? metadataInfo.name : (dataset && dataset.attributes && dataset.attributes.name)}
        description={formattedDescription}
        category="Dataset"
        url={this.props.url}
        user={this.props.user}
        pageHeader
      >
        <div className="c-page-explore-detail">
          <Spinner
            isLoading={loading}
            className="-fixed -light"
          />

          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: 'Explore datasets', route: 'explore' }]}
                />

                <h1>
                  {metadataInfo && metadataInfo.name ? metadataInfo.name : (dataset && dataset.attributes && dataset.attributes.name)}
                </h1>

                <div className="page-header-info">
                  <ul>
                    <li>Source: {(metadata && metadata.attributes.source) || '-'}</li>
                    <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>
                    {/* Favorites <li>Last update: {dataset && dataset.attributes && dataset.attributes.updatedAt}</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* DATASET INFO && ACTIONS */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12 medium-7">
                  {/* Description */}
                  <div className="dataset-info-description">
                    <h3>Description</h3>
                    {formattedDescription}
                  </div>
                </div>
                <div className="column large-offset-2 small-12 medium-3">
                  <div className="dataset-info-actions">
                    <button
                      className="c-button -primary -fullwidth"
                      onClick={this.handleShare}
                    >
                      Share dataset
                    </button>
                    {metadataInfo && metadataInfo.data_download_link &&
                      <a
                        className="c-button -primary -fullwidth"
                        target="_blank"
                        href={metadataInfo && metadataInfo.data_download_link}
                      >
                        Download
                      </a>
                    }
                    {metadataInfo && metadataInfo.data_download_original_link &&
                      <a
                        className="c-button -secondary -fullwidth"
                        target="_blank"
                        href={metadataInfo && metadataInfo.data_download_original_link}
                      >
                        Download from source
                      </a>
                    }
                    {metadataInfo && metadataInfo.learn_more_link &&
                      <a
                        className="c-button -secondary -fullwidth"
                        target="_blank"
                        href={metadataInfo && metadataInfo.learn_more_link}
                      >
                        Learn more
                      </a>
                    }
                    {dataset && dataset.attributes && dataset.attributes.subscribable
                      && this.props.user.id &&
                      <button
                        className="c-button -secondary -fullwidth"
                        onClick={this.handleSubscribe}
                      >
                        Subscribe to alerts
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WIDGET EDITOR */}
          <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
            {dataset &&
              <WidgetEditor
                dataset={dataset.id}
                mode="dataset"
                showSaveButton
              />
            }
          </MediaQuery>

          {/* METADATA */}
          <section className="l-section">
            <div className="row">
              <div className="column small-12 medium-7">
                {functions ? (
                  <div className="l-section-mod">
                    <h3>Function</h3>
                    <p>{formattedFunctions}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.citation ? (
                  <div className="l-section-mod">
                    <h3>Citation</h3>
                    <p>{metadataInfo && metadataInfo.citation}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.geographic_coverage ? (
                  <div className="l-section-mod">
                    <h3>Geographic coverage</h3>
                    <p>{metadataInfo && metadataInfo.geographic_coverage}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.spatial_resolution ? (
                  <div className="l-section-mod">
                    <h3>Spatial resolution</h3>
                    <p>{metadataInfo && metadataInfo.spatial_resolution}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.date_of_content ? (
                  <div className="l-section-mod">
                    <h3>Date of content</h3>
                    <p>{metadataInfo && metadataInfo.date_of_content}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.frequency_of_updates ? (
                  <div className="l-section-mod">
                    <h3>Frequency of updates</h3>
                    <p>{metadataInfo && metadataInfo.frequency_of_updates}</p>
                  </div>
                ) : null}

                {cautions ? (
                  <div className="l-section-mod">
                    <h3>Cautions</h3>
                    <p>{formattedCautions}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.license ? (
                  <div className="l-section-mod">
                    <h3>License</h3>
                    <p>{metadataInfo && metadataInfo.license}</p>
                  </div>
                ) : null}

                {metadataInfo && metadataInfo.language && metadataInfo.language.toLowerCase() !== 'en' ? (
                  <div className="l-section-mod">
                    <h3>Translated title</h3>
                    <p>{metadataInfo && metadataInfo.translated_title}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                {/* SIMILAR DATASETS */}
                <div className="l-section-mod similar-datasets">
                  <div className="row">
                    <div className="column small-12">
                      <h3>Similar datasets</h3>
                      <Spinner
                        isLoading={!similarDatasetsLoaded}
                        className="-relative -light"
                      />
                      {similarDatasets &&
                      <DatasetList
                        active={[]}
                        list={similarDatasets}
                        mode="grid"
                        showActions={false}
                      />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>


          {/* RELATED TOOLS */}
          {/*
          <div className="l-section related-tools">
            <div className="row">
              <div className="column small-12">
                <h3 className="c-text title -thin">Related Tools</h3>
              </div>
            </div>
          </div>
          */}

          {/* RELATED INSIGHTS */}
          {/* <div className="c-page-section related-insights">
            <div className="row">
              <div className="column small-12">
                <h2 className="c-text title -thin">Related Insights</h2>
              </div>
            </div>
          </div> */}

          <aside className="l-postcontent">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12">
                  <Banner className="partners -text-center">
                    <p className="-claim">Take the pulse of our planet</p>
                    <Link route="pulse">
                      <a className="c-button -primary -alt">Launch planet pulse</a>
                    </Link>
                  </Banner>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </Layout>
    );
  }
}

ExploreDetail.propTypes = {
  url: PropTypes.object.isRequired,
  // Store
  user: PropTypes.object,
  // ACTIONS
  resetDataset: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  // Store
  user: state.user,
  exploreDetail: state.exploreDetail,
  layersShown: updateLayersShown(state),
  widgetEditor: PropTypes.object,
  // ACTIONS
  setFilters: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setAggregateFunction: PropTypes.func.isRequired,
  setLimit: PropTypes.func.isRequired,
  setChartType: PropTypes.func.isRequired,
  setVisualizationType: PropTypes.func.isRequired,
  setBand: PropTypes.func.isRequired,
  setLayer: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired
});

const mapDispatchToProps = dispatch => ({
  resetDataset: () => {
    dispatch(resetDataset());
  },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setFilters: filter => dispatch(setFilters(filter)),
  setColor: color => dispatch(setColor(color)),
  setSize: size => dispatch(setSize(size)),
  setCategory: category => dispatch(setCategory(category)),
  setValue: value => dispatch(setValue(value)),
  setOrderBy: value => dispatch(setOrderBy(value)),
  setAggregateFunction: value => dispatch(setAggregateFunction(value)),
  setLimit: value => dispatch(setLimit(value)),
  setChartType: value => dispatch(setChartType(value)),
  setVisualizationType: vis => dispatch(setVisualizationType(vis)),
  setBand: band => dispatch(setBand(band)),
  setLayer: (layerId) => {
    new LayersService()
      .fetchData({ id: layerId })
      .then(layer => dispatch(setLayer(layer)))
      // TODO: better handling of the error
      .catch(err => toastr.error('Error', err));
  },
  setTitle: title => dispatch(setTitle(title))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
