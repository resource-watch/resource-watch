import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import isEqual from 'lodash/isEqual';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter, setPage } from 'redactions/routes';
import { getDatasets } from 'redactions/explore';

// Components
import { Router } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/app/layout/Layout';
import Sidebar from 'components/app/layout/Sidebar';
import DatasetList from 'components/app/explore/DatasetList';
import Paginator from 'components/ui/Paginator';

class ExploreBeta extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getDatasets({
      pageNumber: query.page,
      pageSize: Explore.defaultProps.pageSize
    }));
    return { user, isServer, url, pageNumber: query.page };
  }

  onChangePage(page) {
    // const { pageSize, getDatasets, setPage } = this.props;
    // getDatasets({ pageNumber: page, pageSize });
    // setPage(page);
    Router.replaceRoute('explore', { page });

    // Scrolling to top
    document.getElementsByClassName('sidebar-content')[0].scrollTop = 0;
  }

  render() {
    const {
      datasets,
      loading,
      url,
      mode,
      pageNumber,
      pageSize,
      getDatasets
    } = this.props;

    return (
      <Layout
        title="Explore"
        description="Explore description"
        url={url}
      >
        <div className="p-explore">
          <div className="c-page -dark">

            <Sidebar>
              <div className="row collapse">
                <div className="column small-12">
                  <h1>Explore</h1>

                  {loading ? null :
                    <DatasetList list={datasets} mode={mode}  />
                  }

                  <Paginator
                    options={{
                      page: pageNumber,
                      limit: pageSize,
                      size: 222
                    }}
                    onChange={page => { this.onChangePage(page); }}
                  />
                </div>
              </div>
            </Sidebar>

            <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
              <div className="l-map">
              </div>
            </MediaQuery>

          </div>
        </div>
      </Layout>
    );
  }
}

ExploreBeta.defaultProps = {
  datasets: [],
  loading: false,
  mode: 'grid',
  search: null,
  pageNumber: 1,
  pageSize: 6
};

ExploreBeta.propTypes = {
  datasets: PropTypes.array,
  loading: PropTypes.bool,
  mode: PropTypes.string,
  search: PropTypes.string,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number
};

const mapStateToProps = (state) => {
  const { explore } = state;
  return {
    datasets: explore.datasets.list,
    loading: explore.datasets.loading
  };
};

const mapDispatchToProps = dispatch => ({
  getDatasets: (options) => dispatch(getDatasets(options)),
  setPage: (page) => dispatch(setPage(page))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ExploreBeta);
