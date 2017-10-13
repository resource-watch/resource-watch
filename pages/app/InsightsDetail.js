import React from 'react';
import withRedux from 'next-redux-wrapper';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

import { getInsightBySlug } from 'redactions/insights';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

class InsightsDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getInsightBySlug(query.slug));
    return { user, isServer, url };
  }

  render() {
    const { insight } = this.props;

    if (!insight) return null;

    return (
      <Layout
        title={insight.title}
        description="Read the latest analysis from our community or submit your own original story."
        url={this.props.url}
        user={this.props.user}
        className="page-insights"
        pageHeader
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} />
                  <h1>{ insight.title }</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          {/* Temporary solution.... */}
          <iframe title={insight.title} src={insight.body} width="100%" height={800} frameBorder="0" />
        </section>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({ insight: state.insights.data });

const mapDispatchToProps = dispatch => ({
  getInsightBySlug: slug => dispatch(getInsightBySlug(slug))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(InsightsDetail);
