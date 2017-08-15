import React from 'react';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { initStore } from 'store';
import { getInsightBySlug } from 'redactions/insights';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

class InsightsDetail extends Page {
  componentDidMount() {
    super.componentDidMount();
    this.props.getInsightBySlug(this.props.url.query.slug);
  }

  render() {
    const { insight } = this.props;

    if (!insight) return null;

    console.log(insight);
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
                  <Breadcrumbs items={[{ name: 'Insights', href: '/insights' }]} />
                  <h1>{ insight.title }</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
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
