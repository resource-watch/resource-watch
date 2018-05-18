import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import StaticContent from 'layout/static-content';

// Post-content components
import SuggestStoryPost from 'components/app/static-pages/get-involved/post-content/SuggestStoryPost';
import ContributeDataPostContent from 'components/app/static-pages/get-involved/post-content/ContributeData';
import JoinCommunityPostContent from 'components/app/static-pages/get-involved/post-content/JoinCommunity';
import DevelopYourAppPostContent from 'components/app/static-pages/get-involved/post-content/DevelopYourApp';
import AppsPostContent from 'components/app/static-pages/get-involved/post-content/Apps';

class GetInvolvedDetail extends Page {
  static propTypes = {
    getInvolvedDetail: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string
  };

  getPostContent(id, props = {}) {
    const { getInvolvedDetail } = this.props;
    const pageNotFound = () => null;
    const pages = {
      'suggest-a-story': () => <SuggestStoryPost {...props} insights={getInvolvedDetail.insights} />,
      'contribute-data': () => <ContributeDataPostContent {...props} />,
      'join-the-community': () => <JoinCommunityPostContent {...props} />,
      'develop-your-app': () => <DevelopYourAppPostContent {...props} />,
      apps: () => <AppsPostContent {...props} />
    };

    return pages[id] || pageNotFound;
  }

  render() {
    const {
      getInvolvedDetail,
      breadCrumb,
      url,
      user
    } = this.props;

    const { staticData: data } = getInvolvedDetail;
    const { id } = url.query;

    if (!data) return null;

    const postContent = this.getPostContent(id, data);
    const descriptions = data.description && data.description.split('\n').filter(line => line.length > 0);

    return (
      <Layout
        title={data.title || 'Get Involved'}
        description={data.summary || ''}
        url={url}
        user={user}
      >

        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={breadCrumb} />
                  <h1>{data.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        { data.summary &&
          <section className="l-section -secondary">
            <header className="l-section-header">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12 large-7">
                    <h2>{data.summary}</h2>
                  </div>
                </div>
                { descriptions.length > 0 &&
                  <div className="row">
                    { descriptions.map(description => (
                      <div className={`column small-${12 / descriptions.length}`}>{description}</div>
                    ))}
                  </div>
                }
              </div>
            </header>
          </section> }

        <StaticContent {...data} />
        {postContent()}

      </Layout>
    );
  }
}

GetInvolvedDetail.propTypes = {
  url: PropTypes.object,
  data: PropTypes.object,
  insights: PropTypes.array
};

export default GetInvolvedDetail;
