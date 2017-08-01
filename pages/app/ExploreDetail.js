/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { resetDataset, toggleLayerShown } from 'redactions/exploreDetail';
import { toggleModal, setModalOptions } from 'redactions/modal';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';

// Next
import { Link } from 'routes';

// Services
import DatasetService from 'services/DatasetService';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';
import ShareExploreDetailModal from 'components/modal/ShareExploreDetailModal';
import SubscribeToAlertsModal from 'components/modal/SubscribeToAlertsModal';
import DatasetList from 'components/app/explore/DatasetList';

// Temporal: Only while we are not using the Knowledge Graph
const SIMILAR_DATASETS = ['11de2bc1-368b-42ed-a207-aaff8ece752b', '3de46aa8-120c-454f-b022-464a236f45ed', '8ecf07f5-3cae-4275-adfe-918d04439a1a'];

class ExploreDetail extends Page {
  constructor(props) {
    super(props);

    this.state = {
      similarDatasetsLoaded: false,
      similarDatasets: null,
      dataset: null,
      loading: false,
      downloadURI: null
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
    super.componentDidMount();
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
        this.setState({
          dataset: response,
          datasetLoaded: true,
          loading: false
        });
      }).catch((error) => {
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
    this.datasetService.getDatasets(SIMILAR_DATASETS).then((res) => {
      this.setState({
        similarDatasets: res,
        similarDatasetsLoaded: true
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * UI EVENTS
   * - triggerDownload
   * - handleShare
   * - handleSubscribe
  */
  @Autobind
  triggerDownload() {
    const { tableName, name } = this.state.dataset.attributes;
    this.datasetService.getDownloadURI(tableName, name);
  }
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
      children: SubscribeToAlertsModal,
      childrenProps: {
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { dataset, loading, downloadURI, similarDatasets, similarDatasetsLoaded } = this.state;
    const metadataObj = dataset && dataset.attributes.metadata;
    const metadata = metadataObj && metadataObj.length > 0 && metadataObj[0];
    const metadataAttributes = metadata && metadata.attributes;
    const metadataInfo = metadataAttributes && metadataAttributes.info;

    const downloadButtonClass = classNames({
      '-disabled': downloadURI,
      'c-button': true,
      '-primary': true,
      '-fullwidth': true
    });

    return (
      <Layout
        title="Explore detail"
        description="Explore detail description..."
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
              <div className="page-header-content -padding-b-2">
                <Breadcrumbs
                  items={[{ name: 'Explore datasets', route: 'explore' }]}
                />

                <Title className="-primary -huge page-header-title" >
                  { dataset && dataset.attributes && dataset.attributes.name}
                </Title>

                <div className="page-header-info">
                  <ul>
                    <li>Source: {(metadata && metadata.source) || '-'}</li>
                    <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>
                    {/* Favorites <li>Last update: {dataset && dataset.attributes && dataset.attributes.updatedAt}</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* DATASET INFO && ACTIONS */}
          <div className="c-page-section">
            <section className="c-dataset-info">
              <div className="row">
                <div className="column small-12 medium-7">
                  {/* Description */}
                  <div className="dataset-info-description">
                    {metadataAttributes && metadataAttributes.description}
                  </div>
                </div>
                <div className="column large-offset-2 small-3">
                  <div className="dataset-info-actions">

                    <button
                      className="c-button -secondary -fullwidth"
                      onClick={this.handleShare}
                    >
                      Share/Embed
                    </button>
                    <button
                      className={downloadButtonClass}
                      onClick={this.triggerDownload}
                      disabled={downloadURI}
                    >
                      Download
                    </button>
                    {metadataInfo && metadataInfo.data_download_original_link &&
                      <a
                        className="c-button -primary -fullwidth"
                        href={metadataInfo && metadataInfo.data_download_original_link}
                      >
                        Download from source
                      </a>
                    }
                    {metadataInfo && metadataInfo.learn_more_link &&
                      <a
                        className="c-button -primary -fullwidth"
                        href={metadataInfo && metadataInfo.learn_more_link}
                      >
                        Learn more
                      </a>
                    }
                    <button
                      className="c-button -primary -fullwidth"
                      onClick={this.handleSubscribe}
                    >
                      Subscribe to alerts
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* WIDGET EDITOR */}
          {dataset &&
            <WidgetEditor
              dataset={dataset.id}
              mode="dataset"
              showSaveButton
            />
          }

          {/* METADATA */}
          <div className="c-page-section">
            <section className="c-dataset-metadata">
              <div className="row">
                <div className="column small-12 medium-7">
                  <div className="dataset-info-rest-of-fields">
                    <h2 className="c-text title -thin">Function</h2>
                    <p>{metadataInfo && metadataInfo.functions }</p>
                    <h2 className="c-text title -thin">Cautions</h2>
                    <p>{metadataInfo && metadataInfo.cautions }</p>
                    <h2 className="c-text title -thin">Citation</h2>
                    <p>{metadataInfo && metadataInfo.citation }</p>
                    <h2 className="c-text title -thin">Geographic coverage</h2>
                    <p>{metadataInfo && metadataInfo.geographic_coverage }</p>
                    <h2 className="c-text title -thin">Spatial resolution</h2>
                    <p>{metadataInfo && metadataInfo.spatial_resolution }</p>
                    <h2 className="c-text title -thin">Date of content</h2>
                    <p>{metadataInfo && metadataInfo.date_of_content }</p>
                    <h2 className="c-text title -thin">Frequency of updates</h2>
                    <p>{metadataInfo && metadataInfo.frequency_of_updates }</p>
                    <h2 className="c-text title -thin">License</h2>
                    <a href={metadataInfo && metadataInfo.license_link}>
                      {metadataInfo && metadataInfo.license }
                    </a>
                    <h2 className="c-text title -thin">Language</h2>
                    <p>{metadataAttributes && metadataAttributes.language}</p>
                    {metadataAttributes && metadataAttributes.language !== 'en' &&
                      <div>
                        <h2 className="c-text title -thin">Translated title</h2>
                        <p>{metadataInfo && metadataInfo.translated_title}</p>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </section>
          </div>


          {/* RELATED TOOLS */}
          <div className="c-page-section related-tools">
            <div className="row">
              <div className="column small-12">
                <h2 className="c-text title -thin">Related Tools</h2>
              </div>
            </div>
          </div>

          {/* SIMILAR DATASETS */}
          <div className="c-page-section similar-datasets">
            <div className="row">
              <div className="column small-12">
                <h2 className="c-text title -thin">Similar datasets</h2>
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

          {/* RELATED INSIGHTS */}
          <div className="c-page-section related-insights">
            <div className="row">
              <div className="column small-12">
                <h2 className="c-text title -thin">Related Insights</h2>
              </div>
            </div>
          </div>

          {/* PLANET PULSE */}
          <div className="c-page-section pulse-banner-section">
            <div className="row">
              <div className="column small-12">
                <div className="pulse-banner">
                  <h2 className="c-text title -thin">Planet Pulse</h2>
                  <div className="pulse-banner-container">
                    <div className="action-container">
                      <h1>Take the pulse of our planet</h1>
                      <Link route="pulse">
                        <a
                          className="c-button -primary"
                        >
                          Launch planet pulse
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

ExploreDetail.propTypes = {
  url: PropTypes.object.isRequired,
  // ACTIONS
  resetDataset: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  exploreDetail: state.exploreDetail,
  layersShown: updateLayersShown(state)
});

const mapDispatchToProps = dispatch => ({
  resetDataset: () => {
    dispatch(resetDataset());
  },
  toggleLayerShown: (id) => {
    dispatch(toggleLayerShown(id));
  },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
