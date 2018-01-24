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

class EmbedSimilarDatasets extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const referer = isServer ? req.headers.referer : location.href;
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url, referer, isLoading: true };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: props.isLoading
    };
  }

  componentDidMount() {
    const { url, similarDatasets, loading, error } = this.props;
    this.props.getSimilarDatasets(url.query.id);
  }

  render() {
    const { user, loading } = this.props;
    const { isLoading } = this.state;


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
          <Spinner isLoading={isLoading} className="-light" />

        </div>
      </EmbedLayout>
    );
  }
}

EmbedSimilarDatasets.propTypes = {
  similarDatasets: PropTypes.object,
  getSimilarDatasets: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string
};

EmbedSimilarDatasets.defaultProps = {
  similarDatasets: {}
};

const mapStateToProps = state => ({
  similarDatasets: state.embed.similarDatasets,
  loading: state.embed.similarDatasets.loading,
  error: state.embed.similarDatasets.error,
  user: state.user
});

const mapDispatchToProps = {
  getSimilarDatasets
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedSimilarDatasets);
