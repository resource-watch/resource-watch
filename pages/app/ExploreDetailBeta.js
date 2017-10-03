/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

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

// constants
const LIMIT_CHAR_DESCRIPTION = 1120;

class ExploreDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    const dataset = await store.dispatch(getDataset(url.query.id));
    console.log(dataset);
    return { user, isServer, url, dataset };
  }

  componentDidMount() {

  }

  render() {
    const { url, dataset } = this.props;

    return (
      <Layout
        title="Explore detail"
        description="Explore detail description..."
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

                {/* <h1>
                  {metadataInfo && metadataInfo.name ? metadataInfo.name : (dataset && dataset.attributes && dataset.attributes.name)}
                </h1>

                <div className="page-header-info">
                  <ul>
                    <li>Source: {(metadata && metadata.source) || '-'}</li>
                    <li>Last update: {dataset && dataset.attributes && new Date(dataset.attributes.updatedAt).toJSON().slice(0, 10).replace(/-/g, '/')}</li>}
                  </ul>
                </div> */}
              </div>
            </div>
          </div>

          {/* POSTCONTENT: Banner */}
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
