/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setTopicsTree, toggleLayerGroup } from 'redactions/explore';
import { resetDataset } from 'redactions/exploreDetail';
import { getDataset } from 'redactions/exploreDataset';
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
import { setUser, toggleFavourite } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Next
import { Link, Router } from 'routes';

// Services
import DatasetService from 'services/DatasetService';
import LayersService from 'services/LayersService';
import GraphService from 'services/GraphService';
import UserService from 'services/UserService';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Icon from 'components/ui/Icon';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/editor/WidgetEditor';
import ShareExploreDetailModal from 'components/modal/ShareExploreDetailModal';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
import LoginModal from 'components/modal/LoginModal';
import DatasetList from 'components/app/explore/DatasetList';
import Banner from 'components/app/common/Banner';

import Error from '../_error';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';
import { logEvent } from 'utils/analytics';

class ExploreDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, res, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getDataset(url.query.id));

    const { exploreDataset } = store.getState();
    if (!exploreDataset && res) res.statusCode = 404;
    if (exploreDataset && !exploreDataset.data.published && res) res.statusCode = 404;

    return { user, isServer, url };
  }

  constructor(props) {
    super(props);

    this.state = {
      dataset: null,
      loading: false,
      similarDatasetsLoaded: false,
      similarDatasets: [],
      showDescription: false,
      showFunction: false,
      showCautions: false,
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
    this.handleShare = this.handleShare.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleFavoriteButtonClick = this.handleFavoriteButtonClick.bind(this);
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
    this.getSimilarDatasets();
    this.loadTopicsTree();
    this.countView(this.props.url.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      this.props.resetDataset();
      this.setState({
        similarDatasetsLoaded: false,
        datasetLoaded: false
      }, () => {
        this.datasetService = new DatasetService(nextProps.url.query.id, {
          apiURL: process.env.WRI_API_URL,
          language: nextProps.locale
        });
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        this.getDataset();
        this.getSimilarDatasets();
      });

      this.countView(nextProps.url.query.id);
    }
  }

  componentWillUnmount() {
    this.props.resetDataset();
  }

  /**
   * HELPERS
   * - getDataset
   * - getSimilarDatasets
   * - loadTopicsTree
   * - loadInferredTags
  */
  loadTopicsTree() {
    const { topicsTree } = this.props;

    if (!topicsTree) {
      fetch(new Request('/static/data/TopicsTreeLite.json', { credentials: 'same-origin' }))
        .then(response => response.json())
        .then((data) => {
          // Save the topics tree as variable for later use
          this.props.setTopicsTree(data);
        });
    }
  }

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

        // Load inferred tags
        const vocabulary = response.attributes.vocabulary;
        const tags = vocabulary && vocabulary.length > 0 && vocabulary[0].attributes.tags;
        if (tags) {
          this.loadInferredTags(tags);
        }
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

  getSimilarDatasets() {
    this.setState({ similarDatasetsLoaded: false });

    this.datasetService.getSimilarDatasets()
      .then(res => res.map(val => val.dataset).slice(0, 7))
      .then((ids) => {
        if (ids.length === 0) return [];
        return DatasetService.getDatasets(ids, this.props.locale, 'widget,metadata,layer,vocabulary');
      })
      .then(similarDatasets => this.setState({ similarDatasets }))
      .catch((err) => {
        console.error(err);
        toastr.error('Error', 'Unable to load the similar datasets');
      })
      .then(() => this.setState({ similarDatasetsLoaded: true }));
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
   * Gather the number of views of this dataset
   * @param {string} datasetId Dataset ID
   */
  countView(datasetId) {
    this.graphService.countDatasetView(datasetId, this.props.user.token);
  }

  /**
   * UI EVENTS
   * - handleShare
   * - handleSubscribe
   * - handleOpenInExplore
   * - handleTagSelected
  */
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
        datasetName: this.state.dataset.attributes.name,
        showEmbed: widget && widget.attributes !== null,
        toggleModal: this.props.toggleModal
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }
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
    const tagSt = `["${tag}"]`;
    let treeSt = 'topics';
    if (labels.includes('TOPIC')) {
      treeSt = 'topics';
    } else if (labels.includes('GEOGRAPHY')) {
      treeSt = 'geographies';
    } else if (labels.includes('DATA_TYPE')) {
      treeSt = 'dataType';
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

  handleFavoriteButtonClick() {
    const { user, url } = this.props;
    const { dataset } = this.state;
    const favourite = user.favourites.find(f => f.attributes.resourceId === url.query.id);

    this.setState({ loading: true });

    this.props.toggleFavourite({
      favourite,
      user,
      resource: {
        type: 'dataset',
        id: dataset.id
      }
    })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  render() {
    const { url, user, exploreDataset } = this.props;
    const { dataset, loading, similarDatasets, similarDatasetsLoaded, inferredTags } = this.state;
    const metadataObj = dataset && dataset.attributes.metadata;
    const metadata = metadataObj && metadataObj.length > 0 && metadataObj[0];
    const metadataAttributes = (metadata && metadata.attributes) || {};
    const metadataInfo = (metadataAttributes && metadataAttributes.info) || {};
    const { description } = metadataAttributes;
    const { functions, cautions } = metadataInfo;

    const showOpenInExploreButton = dataset && dataset.attributes.layer && dataset.attributes.layer.length > 0;

    const favourite = user.favourites.find(f => f.attributes.resourceId === url.query.id);

    const formattedDescription = this.shortenAndFormat(description, 'showDescription');
    const formattedFunctions = this.shortenAndFormat(functions, 'showFunction');
    const formattedCautions = this.shortenAndFormat(cautions, 'showCautions');

    const starIconName = favourite ? 'icon-star-full' : 'icon-star-empty';
    const starIconClass = classnames({
      '-small': true,
      '-filled': favourite,
      '-empty': !favourite
    });

    if (exploreDataset && exploreDataset.error === 'Not Found') return <Error status={404} />;
    if (dataset && !dataset.attributes.published) return <Error status={404} />;

    return (
      <Layout
        title={metadataInfo && metadataInfo.name ? metadataInfo.name : (dataset && dataset.attributes && dataset.attributes.name)}
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
                    {/* Favorite dataset icon */}
                    {user && user.id &&
                      <li>
                        <div
                          className="favourite-button"
                          onClick={this.handleFavoriteButtonClick}
                          title="Favorite dataset"
                          role="button"
                          tabIndex={-1}
                        >
                          <Icon
                            name={starIconName}
                            className={starIconClass}
                          />
                        </div>
                      </li>
                    }
                    {/* Favorites */}
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
                  {/* Function */}
                  <div className="l-section-mod">
                    <h3>Function</h3>
                    <p>{formattedFunctions}</p>
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
                        Learn more
                      </a>
                    }
                    {dataset && dataset.attributes && dataset.attributes.subscribable &&
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
                showSaveButton={!!(user && user.id)}
                showNotLoggedInText
              />
            }
          </MediaQuery>

          {/* METADATA */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12 medium-7">

                  {metadataInfo && metadataInfo.technical_title ? (
                    <div className="l-section-mod">
                      <h3>Formal name</h3>
                      <p>{metadataInfo.technical_title}</p>
                    </div>
                  ) : null}

                  {functions ? (
                    <div className="dataset-info-description">
                      <h3>Description</h3>
                      {formattedDescription}
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.geographic_coverage ? (
                    <div className="l-section-mod">
                      <h3>Geographic coverage</h3>
                      <p>{metadataInfo.geographic_coverage}</p>
                    </div>
                  ) : null}

                  {dataset && dataset.attributes && dataset.attributes.type ? (
                    <div className="l-section-mod">
                      <h3>Data type</h3>
                      <p>{dataset.attributes.type}</p>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.spatial_resolution ? (
                    <div className="l-section-mod">
                      <h3>Spatial resolution</h3>
                      <p>{metadataInfo.spatial_resolution}</p>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.date_of_content ? (
                    <div className="l-section-mod">
                      <h3>Date of content</h3>
                      <p>{metadataInfo.date_of_content}</p>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.frequency_of_updates ? (
                    <div className="l-section-mod">
                      <h3>Frequency of updates</h3>
                      <p>{metadataInfo.frequency_of_updates}</p>
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
                      <p>
                        {!!metadataInfo.license_link &&
                          <a href={metadataInfo.license_link} target="_blank" rel="noopener noreferrer">{metadataInfo.license}</a>
                        }
                        {!metadataInfo.license_link &&
                          metadataInfo.license
                        }
                      </p>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.summary_of_license ? (
                    <div className="l-section-mod">
                      <h3>Summary of license</h3>
                      <p>{metadataInfo.summary_of_license}</p>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.link_to_license ? (
                    <div className="l-section-mod">
                      <h3>Link to full license</h3>
                      <a href={metadataInfo.link_to_license} target="_blank">
                        {metadataInfo.link_to_license}
                      </a>
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.sources ? (
                    <div className="l-section-mod">
                      <h3>Sources</h3>
                      {metadataInfo.sources.map(source => (
                        <div
                          key={source['source-name']}
                        >
                          {source['source-name']}
                          {source['source-description']}
                        </div>)
                      )
                      }
                    </div>
                  ) : null}

                  {metadataInfo && metadataInfo.citation ? (
                    <div className="l-section-mod">
                      <h3>Citation</h3>
                      <p>{metadataInfo && metadataInfo.citation}</p>
                    </div>
                  ) : null}

                  {metadataAttributes && metadataAttributes.language ? (
                    <div className="l-section-mod">
                      <h3>Published language</h3>
                      <p>{metadataAttributes.language}</p>
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
                        {similarDatasets && similarDatasets.length > 0 &&
                        <DatasetList
                          active={[]}
                          list={similarDatasets}
                          mode="grid"
                          showActions={false}
                          showFavorite={false}
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

ExploreDetail.propTypes = {
  url: PropTypes.object.isRequired,
  // Store
  user: PropTypes.object,
  widgetEditor: PropTypes.object,
  locale: PropTypes.string.isRequired,
  // ACTIONS
  resetDataset: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
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
  setTitle: PropTypes.func.isRequired,
  setTopicsTree: PropTypes.func.isRequired,
  toggleLayerGroup: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  // Store
  user: state.user,
  topicsTree: state.explore.topicsTree,
  exploreDetail: state.exploreDetail,
  exploreDataset: state.exploreDataset,
  layersShown: updateLayersShown(state),
  locale: state.common.locale
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
      .catch((err) => {
        console.error(err);
        toastr.error('Error', 'Unable to load the layer of the widget.');
      });
  },
  setTitle: title => dispatch(setTitle(title)),
  setTopicsTree: tree => dispatch(setTopicsTree(tree)),
  toggleLayerGroup: (datasetID, addLayer) => dispatch(toggleLayerGroup(datasetID, addLayer)),
  toggleFavourite: options => dispatch(toggleFavourite(options))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
