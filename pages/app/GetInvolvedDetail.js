import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';
import { getInsights } from 'redactions/insights';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// content components
import SubmitAnInsightContent from 'components/app/static-pages/get-involved/content/SubmitAnInsight';
import ContributeDataContent from 'components/app/static-pages/get-involved/content/ContributeData';
import JoinCommunityContent from 'components/app/static-pages/get-involved/content/JoinCommunity';
import DevelopYourAppContent from 'components/app/static-pages/get-involved/content/DevelopYourApp';

// post-content components
import SubmitAnInsightPostContent from 'components/app/static-pages/get-involved/post-content/SubmitAnInsight';
import ContributeDataPostContent from 'components/app/static-pages/get-involved/post-content/ContributeData';
import JoinCommunityPostContent from 'components/app/static-pages/get-involved/post-content/JoinCommunity';
import DevelopYourAppPostContent from 'components/app/static-pages/get-involved/post-content/DevelopYourApp';
import AppsPostContent from 'components/app/static-pages/get-involved/post-content/Apps';

class GetInvolvedDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    const { routes } = context.store.getState();

    // Get static data
    context.store.dispatch(getStaticData(routes.query.id));
    if (routes.query.id === 'submit-an-insight') {
      await context.store.dispatch(getInsights());
    }
    return { ...props };
  }


  static getContent(id, props = {}) {
    const pageNotFound = () => null;
    const pages = {
      'submit-an-insight': () => <SubmitAnInsightContent {...props} />,
      'contribute-data': () => <ContributeDataContent {...props} />,
      'join-community': () => <JoinCommunityContent {...props} />,
      'develop-app': () => <DevelopYourAppContent {...props} />
    };

    return pages[id] || pageNotFound;
  }

  getPostContent(id, props = {}) {
    const pageNotFound = () => null;
    const pages = {
      'submit-an-insight': () => <SubmitAnInsightPostContent {...props} insights={this.props.insights} />,
      'contribute-data': () => <ContributeDataPostContent {...props} />,
      'join-community': () => <JoinCommunityPostContent {...props} />,
      'develop-app': () => <DevelopYourAppPostContent {...props} />,
      'apps': () => <AppsPostContent {...props} />
    };

    return pages[id] || pageNotFound;
  }

  render() {
    const { url, user, data } = this.props;
    const id = url.query.id;
    const selectedData = data[id] || {};

    if (!data) return null;

    const content = GetInvolvedDetail.getContent(id, selectedData);
    const postContent = this.getPostContent(id, selectedData);

    const breadcrumbsItems = url.query.source === 'home' ?
      [{ name: 'Home', href: '/' }] :
      [{ name: 'Get involved', href: '/get-involved' }];

    return (
      <Layout
        title={data.title || 'Get Involved detail'}
        description={data.summary || 'Get Involved summary'}
        url={url}
        user={user}
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={breadcrumbsItems} />
                  <h1>{selectedData.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        { selectedData.summary &&
          <section className="l-section -secondary">
            <header className="l-section-header">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12 large-7">
                    <h2>{selectedData.summary}</h2>
                    {selectedData.description &&
                      <p>{selectedData.description}</p>}
                  </div>
                </div>
              </div>
            </header>
          </section> }

        {content()}
        {postContent()}

      </Layout>
    );
  }
}

GetInvolvedDetail.propTypes = {
  url: PropTypes.object,
  data: PropTypes.object,
  insights: PropTypes.array,
  getStaticData: PropTypes.func,
  getInsights: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages,
  insights: state.insights.list
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug) => {
    dispatch(getStaticData(slug));
  },
  getInsights: () => dispatch(getInsights())
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolvedDetail);
