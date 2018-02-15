/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getDataset, getPartner, getTools, getTags, setTools, setTags, setCountView } from 'redactions/exploreDataset';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Services
import GraphService from 'services/GraphService';
import UserService from 'services/UserService';

// Explore Detail Component
import ExploreDetailHeader from 'components/explore-detail/explore-detail-header';
import ExploreDetailInfo from 'components/explore-detail/explore-detail-info';
import ExploreDetailRelatedTools from 'components/explore-detail/explore-detail-related-tools';
import ExploreDetailActions from 'components/explore-detail/explore-detail-actions';
import ExploreDetailTags from 'components/explore-detail/explore-detail-tags';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import ReadMore from 'components/ui/ReadMore';

import WidgetEditor from 'widget-editor';
import Banner from 'components/app/common/Banner';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';


// Utils
import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';
import { TOOLS_CONNECTIONS } from 'utils/apps/toolsConnections';

// Utils
import {
  getDatasetMetadata,
  getDatasetName,
  getDatasetDefaultEditableWidget
} from 'components/explore-detail/explore-detail-helpers';

import Error from '../_error';

class ExploreDetail extends Page {
  static propTypes = {
    url: PropTypes.object.isRequired,
    user: PropTypes.object,
    locale: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, res } = context;

    await store.dispatch(getDataset(props.url.query.id));

    // Check if the dataset exists and it is published
    const { exploreDataset } = store.getState();
    const dataset = exploreDataset.data;
    if (!dataset && res) res.statusCode = 404;
    if (dataset && !dataset.published && res) res.statusCode = 404;

    const { id, vocabulary } = dataset;

    // Set tags
    const tags = vocabulary && vocabulary.length > 0 && vocabulary[0].tags;
    if (tags) {
      store.dispatch(setTags(tags));
    }

    // Load connected partner
    const partnerConnection = PARTNERS_CONNECTIONS.find(pc => pc.datasetId === id);
    if (partnerConnection) {
      await store.dispatch(getPartner(partnerConnection.partnerId));
    }

    // Set tools and load connected tools
    const toolsConnections = TOOLS_CONNECTIONS.filter(appC => appC.datasetId === id).map(v => v.appSlug);
    if (toolsConnections.length > 0) {
      store.dispatch(setTools(toolsConnections));
      await store.dispatch(getTools());
    }

    return { ...props };
  }

  constructor(props) {
    super(props);

    this.state = {
      dataset: null
    };

    // ----------------------- Bindings ----------------------
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
    this.props.setCountView();
    this.props.getTags();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
      this.props.setCountView();
      this.props.getTags();
    }
  }

  componentWillUnmount() {
    // this.props.toggleModal(false);
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

    const dataset = exploreDataset.data;
    const datasetName = getDatasetName(dataset);
    const metadata = getDatasetMetadata(dataset);
    const defaultEditableWidget = getDatasetDefaultEditableWidget(dataset);

    if (exploreDataset && exploreDataset.error === 'Not Found') return <Error status={404} />;
    if (dataset && !dataset.published) return <Error status={404} />;

    return (
      <Layout
        title={datasetName}
        description={metadata.description || ''}
        category="Dataset"
        url={url}
        user={user}
        pageHeader
      >
        <div className="c-page-explore-detail">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <ExploreDetailHeader />
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
                  <ReadMore
                    text={metadata.description}
                  />
                </div>

                <div className="column large-offset-2 small-12 medium-3">
                  <ExploreDetailActions />
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

                  <ExploreDetailTags />
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
  locale: state.common.locale,
  user: state.user,
  exploreDataset: state.exploreDataset
});

const mapDispatchToProps = {
  getDataset,
  getPartner,
  getTools,
  setTools,
  getTags,
  setTags,
  setCountView,
  toggleModal,
  setModalOptions
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
