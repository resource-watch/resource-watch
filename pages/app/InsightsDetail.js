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
  state = {
    height: 800
  }

  componentDidMount() {
    this.props.getInsightBySlug(this.props.url.query.slug);
  }

  onLoadIframe = () => {
    const iFrameID = document.getElementById('iframe-id');

    if (iFrameID) {
      // // here you can make the height, I delete it first, then I make it again
      iFrameID.height = '';
      iFrameID.height = `${iFrameID.contentWindow.document.body.scrollHeight}px`;

      this.setState({
        height: iFrameID.contentWindow.document.body.scrollHeight
      });
    }
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

                  <div className="page-header-info">
                    <ul>
                      <li>{insight.date}</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          {/* Temporary solution.... */}
          <iframe id="iframe-id" title={insight.title} src={insight.body} width="100%" height={this.state.height} frameBorder="0" onLoad={this.onLoadIframe} />
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
