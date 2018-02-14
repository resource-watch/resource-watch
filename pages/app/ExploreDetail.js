/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleLayerGroup } from 'redactions/explore';
import { getDataset, getPartner, getTools, setTools } from 'redactions/exploreDataset';
import { resetDataset } from 'redactions/exploreDetail';
import { toggleModal, setModalOptions } from 'redactions/modal';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';

// Next
import { Link, Router } from 'routes';

// Services
import DatasetService from 'services/DatasetService';
import GraphService from 'services/GraphService';
import UserService from 'services/UserService';

// Explore Detail Component
import ExploreDetailHeader from 'components/explore-detail/explore-detail-header';
import ExploreDetailInfo from 'components/explore-detail/explore-detail-info';
import ExploreDetailRelatedTools from 'components/explore-detail/explore-detail-related-tools';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'widget-editor';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import LoginModal from 'components/modal/LoginModal';
import Banner from 'components/app/common/Banner';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';


// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';
import { logEvent } from 'utils/analytics';
import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';
import { TOOLS_CONNECTIONS } from 'utils/apps/toolsConnections';

import Error from '../_error';

class ExploreDetail extends Page {
  static propTypes = {
    url: PropTypes.object.isRequired,
    user: PropTypes.object,
    locale: PropTypes.string.isRequired,
    resetDataset: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    toggleLayerGroup: PropTypes.func.isRequired
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, res } = context;

    await store.dispatch(getDataset(props.url.query.id));

    // Check if the dataset exists and it is published
    const { exploreDataset } = store.getState();
    if (!exploreDataset && res) res.statusCode = 404;
    if (exploreDataset && !exploreDataset.data.published && res) res.statusCode = 404;


    // Load connected partner
    const partnerConnection = PARTNERS_CONNECTIONS.find(pc => pc.datasetId === exploreDataset.data.id);
    if (partnerConnection) {
      await store.dispatch(getPartner(partnerConnection.partnerId));
    }

    // Load connected tools
    const toolsConnections = TOOLS_CONNECTIONS.filter(appC => appC.datasetId === exploreDataset.data.id).map(v => v.appSlug);
    if (toolsConnections.length > 0) {
      store.dispatch(setTools(toolsConnections));
      await store.dispatch(getTools());
    }

    return { ...props };
  }

  constructor(props) {
    super(props);

    this.state = {
      dataset: null,
      loading: false,
      showFunction: false,
      inferredTags: []
    };

    // DatasetService
    this.datasetService = new DatasetService(props.url.query.id, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });
    // GraphService
    this.graphService = new GraphService({ apiURL: process.env.WRI_API_URL });
    // UserService
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ----------------------- Bindings ----------------------
    this.handleOpenInExplore = this.handleOpenInExplore.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleSaveWidget = this.handleSaveWidget.bind(this);
    //--------------------------------------------------------
  }

  /**
   * Component Lifecycle
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    this.getDataset();
    this.countView(this.props.url.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      this.props.resetDataset();
      this.setState({
        datasetLoaded: false
      }, () => {
        this.datasetService = new DatasetService(nextProps.url.query.id, {
          apiURL: process.env.WRI_API_URL,
          language: nextProps.locale
        });
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        this.getDataset();
      });

      this.countView(nextProps.url.query.id);
    }
  }

  componentWillUnmount() {
    this.props.resetDataset();
    this.props.toggleModal(false);
  }

  /**
   * HELPERS
   * - getDataset
   * - loadInferredTags
  */

  getDataset() {
    this.setState({
      loading: true
    }, () => {
      this.datasetService.fetchData('layer,metadata,vocabulary,widget').then((response) => {
        // Load inferred tags
        const vocabulary = response.attributes.vocabulary;
        const tags = vocabulary && vocabulary.length > 0 && vocabulary[0].attributes.tags;
        if (tags) {
          this.loadInferredTags(tags);
        }

        this.setState({
          dataset: response,
          datasetLoaded: true,
          loading: false
        });
      }).catch((error) => {
        toastr.error('Error', 'Unable to load the dataset');
        console.error(error);
        this.setState({
          loading: false
        });
      });
    });
  }

  loadInferredTags(tags) {
    this.graphService.getInferredTags(tags)
      .then((response) => {
        this.setState({
          inferredTags: response.filter(tag => tag.labels
            .find(type => type === 'TOPIC' || type === 'GEOGRAPHY') &&
            !TAGS_BLACKLIST.includes(tag.id)
          )
        });
      })
      .catch((err) => {
        this.setState({ inferredTags: [] });
        console.error(err);
      });
  }

  /**
   * Gather the number of views of this dataset
   * @param {string} datasetId Dataset ID
   */
  countView(datasetId) {
    this.graphService.countDatasetView(datasetId, this.props.user.token);
  }

  /**
   * UI EVENTS
   * - handleSubscribe
   * - handleOpenInExplore
   * - handleTagSelected
  */

  handleSubscribe() {
    const { user } = this.props;
    let options = null;
    // ----- the user is logged in ------
    if (user.id) {
      options = {
        children: SubscribeToDatasetModal,
        childrenProps: {
          toggleModal: this.props.toggleModal,
          dataset: this.state.dataset,
          showDatasetSelector: false
        }
      };
    } else {
    // ------ anonymous user ---------
      options = {
        children: LoginModal,
        childrenProps: {
          toggleModal: this.props.toggleModal,
          text: 'Log in to subscribe to dataset changes'
        }
      };
    }

    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  handleOpenInExplore() {
    const { dataset } = this.state;
    this.props.toggleLayerGroup(dataset.id, true);
  }

  handleTagSelected(tag, labels = ['TOPIC']) { // eslint-disable-line class-methods-use-this
    const tagSt = `["${tag.id}"]`;
    let treeSt = 'topics';
    if (labels.includes('TOPIC')) {
      treeSt = 'topics';
    } else if (labels.includes('GEOGRAPHY')) {
      treeSt = 'geographies';
    } else if (labels.includes('DATA_TYPE')) {
      treeSt = 'dataTypes';
    }

    Router.pushRoute('explore', { [treeSt]: tagSt });
  }

  // FIXME: refactor this, if a UI element's purpose is to
  // redirect the user, then use a link
  // A button is semantically different
  handleTagClick(event) {
    const element = event.target;
    this.handleTagSelected(element.getAttribute('id'), element.getAttribute('data-labels'));
  }

  /**
   * Shorten the given text and format it so the full length
   * can be toggled via a button modifying the state
   * @param {string} [text=''] Text to shorten
   * @param {string} fieldToManage Property of the state to toggle
   * @param {number} [limitChar=1120] Limit of characters
   * @returns
   */
  shortenAndFormat(text = '', fieldToManage, limitChar = 1120) {
    if (text.length <= limitChar) {
      return text;
    }

    const visible = this.state[fieldToManage] || false;
    const shortenedText = text.substr(0, limitChar);

    return (
      <div className="shortened-text">
        {!visible ? `${shortenedText}...` : text}
        <button
          className={classnames('read-more', { '-less': visible })}
          onClick={() => this.setState({ [fieldToManage]: !visible })}
        >
          {visible ? 'Read less' : 'Read more'}
        </button>
      </div>
    );
  }

  handleSaveWidget() {
    const { dataset } = this.state;
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset: dataset.id,
        getWidgetConfig: this.onGetWidgetConfig
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const {
      url, user, exploreDataset
    } = this.props;
    const {
      dataset, loading, inferredTags
    } = this.state;
    const metadataObj = dataset && dataset.attributes.metadata;
    const metadata = metadataObj && metadataObj.length > 0 && metadataObj[0];
    const metadataAttributes = (metadata && metadata.attributes) || {};
    const metadataInfo = (metadataAttributes && metadataAttributes.info) || {};
    const datasetName = metadataInfo && metadataInfo.name ? metadataInfo.name : (dataset && dataset.attributes && dataset.attributes.name);
    const { description } = metadataAttributes;
    const { functions } = metadataInfo;

    const defaultEditableWidget = dataset && dataset.attributes.widget.find(widget => widget.attributes.defaultEditableWidget === true);

    const showOpenInExploreButton = dataset && dataset.attributes.layer && dataset.attributes.layer.length > 0;

    const formattedFunctions = this.shortenAndFormat(functions || '', 'showFunction');

    const isSubscribable = dataset && dataset.attributes && dataset.attributes.subscribable &&
      Object.keys(dataset.attributes.subscribable).length > 0;

    if (exploreDataset && exploreDataset.error === 'Not Found') return <Error status={404} />;
    if (dataset && !dataset.attributes.published) return <Error status={404} />;

    return (
      <Layout
        title={datasetName}
        description={description || ''}
        category="Dataset"
        url={url}
        user={user}
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
              <ExploreDetailHeader />
            </div>
          </div>

          {/* DATASET INFO && ACTIONS */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12 medium-7">
                  {/* Function */}
                  <div className="l-section-mod">
                    <h3>Function</h3>
                    <p>{formattedFunctions}</p>
                  </div>
                </div>
                <div className="column large-offset-2 small-12 medium-3">
                  <div className="dataset-info-actions">
                    {showOpenInExploreButton &&
                      <Link
                        route="explore"
                        params={{
                          layers: encodeURIComponent(JSON.stringify([{
                            dataset: dataset.id,
                            visible: true,
                            layers: dataset.attributes.layer.map(((l, i) => ({
                              id: l.id, active: i === 0
                            })))
                          }]))
                        }}
                      >
                        <a className="c-button -primary -fullwidth">
                          Open in Explore
                        </a>
                      </Link>
                    }
                    {metadataInfo && metadataInfo.data_download_link &&
                      <a
                        className="c-button -primary -fullwidth"
                        target="_blank"
                        href={metadataInfo && metadataInfo.data_download_link}
                        onClick={() => logEvent('Explore', 'Download data', dataset && dataset.attributes.name)}
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
                        <div className="learn-more-button">
                          <div>
                            Learn more
                          </div>
                          <Icon name="icon-external" className="-smaller" />
                        </div>
                      </a>
                    }
                    {isSubscribable &&
                      <button
                        className="c-button -secondary -fullwidth"
                        onClick={this.handleSubscribe}
                      >
                        Subscribe to alerts
                      </button>
                    }
                  </div>

                  {exploreDataset.partner.data.logo &&
                    <div className="partner-container">
                      <div className="partner-text-container">
                        Partner:
                      </div>
                      <div className="partner-logo-container">
                        <a href={exploreDataset.partner.data.website} target="_blank" rel="noopener noreferrer">
                          <img src={exploreDataset.partner.data.logo && exploreDataset.partner.data.logo.medium} alt={exploreDataset.partner.data.name} />
                        </a>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </section>

          {/* WIDGET EDITOR */}
          <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
            {dataset &&
              <WidgetEditor
                datasetId={dataset.id}
                widgetId={defaultEditableWidget && defaultEditableWidget.id}
                saveButtonMode="auto"
                embedButtonMode="auto"
                titleMode="auto"
                provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
                onSave={this.handleSaveWidget}
              />
            }
          </MediaQuery>

          {/* METADATA */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12 medium-7">
                  <ExploreDetailInfo />
                </div>
              </div>

              <div className="row">
                <div className="column small-12">
                  {/* TAGS SECTION */}
                  <h3>Tags</h3>
                  <div className="tags">
                    {inferredTags && inferredTags.map(tag => (
                      <div
                        role="button"
                        tabIndex={-1}
                        className="tag"
                        id={tag.id}
                        data-labels={tag.labels}
                        key={tag.id}
                        onClick={this.handleTagClick}
                      >
                        {tag.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  {/* SIMILAR DATASETS */}
                  <div className="similar-datasets">
                    <div className="row">
                      <div className="column small-12">
                        <Title className="-extrabig -secondary -p-secondary">
                          Similar datasets
                        </Title>

                        {dataset &&
                          <SimilarDatasets
                            datasetIds={[dataset.id]}
                            onTagSelected={this.handleTagSelected}
                          />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RELATED TOOLS */}
          {exploreDataset.tools.active.length > 0 &&
            <section className="l-section">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <div className="related-tools">
                      <div className="row">
                        <div className="column small-12">
                          <Title className="-extrabig -secondary -p-secondary">
                            Related tools
                          </Title>

                          <ExploreDetailRelatedTools />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          }

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
                    <p className="-claim">Take the pulse of our planet.</p>

                    <a href="/data/pulse" className="c-button -primary -alt">Launch Planet Pulse</a>
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

const mapStateToProps = state => ({
  // Store
  user: state.user,
  exploreDataset: state.exploreDataset,

  // Unnecessary?
  exploreDetail: state.exploreDetail,
  partnerDetail: state.partnerDetail.data,
  layersShown: updateLayersShown(state),
  locale: state.common.locale,
  tools: state.tools.list
});

const mapDispatchToProps = {
  getDataset,
  getPartner,
  resetDataset,
  toggleModal,
  setModalOptions,
  toggleLayerGroup,
  getTools
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
