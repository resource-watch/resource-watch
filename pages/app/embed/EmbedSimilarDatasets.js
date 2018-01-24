import React from 'react';
import PropTypes from 'prop-types';
// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { getSimilarDatasets } from 'redactions/embed';

// Components
import Page from 'components/app/layout/Page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/app/explore/DatasetList';

class EmbedSimilarDatasets extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const referer = isServer ? req.headers.referer : location.href;
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url, referer };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { url } = this.props;
    this.props.getSimilarDatasets(url.query.id);
  }

  render() {
    const { loading, similarDatasets } = this.props;

    console.log('loading', loading, 'similarDatasets', similarDatasets);

    if (loading) {
      return (
        <EmbedLayout
          title={'Loading similar datasets...'}
          description={''}
        >
          <div className="c-embed-similar-datasets">
            <Spinner isLoading className="-light" />
          </div>
        </EmbedLayout>
      );
    }

    return (
      <EmbedLayout
        title={``}
        description={``}
      >
        <div className="c-embed-similar-datasets">
          <Spinner isLoading={loading} className="-light" />
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
      </EmbedLayout>
    );
  }
}

EmbedSimilarDatasets.propTypes = {
  similarDatasets: PropTypes.array.isRequired,
  getSimilarDatasets: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

EmbedSimilarDatasets.defaultProps = {
  similarDatasets: {}
};

const mapStateToProps = state => ({
  similarDatasets: state.embed.similarDatasets.data,
  loading: state.embed.similarDatasets.loading,
  error: state.embed.similarDatasets.error
});

const mapDispatchToProps = {
  getSimilarDatasets
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedSimilarDatasets);
