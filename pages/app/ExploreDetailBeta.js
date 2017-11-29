/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getDataset } from 'redactions/exploreDataset';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Next
import { Link } from 'routes';


// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
// import Spinner from 'components/ui/Spinner';
// import WidgetEditor from 'components/widgets/editor/WidgetEditor';
// import ShareExploreDetailModal from 'components/modal/ShareExploreDetailModal';
// import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';
// import DatasetList from 'components/app/explore/DatasetList';
import Banner from 'components/app/common/Banner';

class ExploreDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getDataset(url.query.id));
    return { user, isServer, url };
  }

  getDatasetName() {
    const { data } = this.props.dataset;
    const { metadata } = data || {};

    if (data && metadata && metadata.length && metadata.name !== '') {
      return metadata.name;
    } else if (data) {
      return data.name;
    }
    return 'Explore';
  }

  getDatasetDescription() {
    const { data } = this.props.dataset;
    const { metadata } = data || {};

    if (data && metadata && metadata.length && metadata.description !== '') {
      return metadata.description;
    }
    return 'Explore detail description.';
  }

  render() {
    const { data } = this.props.dataset;
    const { url } = this.props;
    const title = this.getDatasetName();
    const metadataFields = [
      'functions',
      'formattedCautions',
      'citation',
      'geographic_coverage',
      'spatial_resolution',
      'date_of_content',
      'frequency_of_updates',
      'language'
    ];

    return (
      <Layout
        title={title}
        description={this.getDatasetDescription()}
        url={url}
        pageHeader
      >
        <div className="c-page-explore-detail">

          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: 'Explore datasets', route: 'explore' }]}
                />

                <h1>{title}</h1>

                {/* <div className="page-header-info">
                  <ul>
                    <li>Source: {(metadata && metadata.source) || '-'}</li>
                    <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>}
                  </ul>
                </div> */}
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
                    {data.metadata.description}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* METADATA */}
          <section className="l-section">
            <div className="row">
              <div className="column small-12 medium-7">
                {metadataFields.map((m, i) =>
                  data.metadata[metadataFields[i]] && (
                    <div className="l-section-mod" key={metadataFields[i]}>
                      <h3>{capitalize(metadataFields[i].split('_').join(' '))}</h3>
                      <p>{data.metadata[metadataFields[i]]}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* POSTCONTENT: Banner */}
          <aside className="l-postcontent">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12">
                  <Banner className="partners -text-center">
                    <p className="-claim">Take the pulse of our planet</p>
                    <a href="/data/pulse" className="c-button -primary -alt">Launch planet pulse</a>
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
  user: PropTypes.object,
  dataset: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  dataset: state.exploreDataset
});

const mapDispatchToProps = dispatch => ({

});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreDetail);
