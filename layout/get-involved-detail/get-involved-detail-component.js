import { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import StaticContent from 'layout/static-content';
import SuggestStoryPost from 'components/app/static-pages/get-involved/post-content/SuggestStoryPost';
import ContributeDataPostContent from 'components/app/static-pages/get-involved/post-content/ContributeData';
import JoinCommunityPostContent from 'components/app/static-pages/get-involved/post-content/JoinCommunity';
import DevelopYourAppPostContent from 'components/app/static-pages/get-involved/post-content/DevelopYourApp';
import AppsPostContent from 'components/app/static-pages/get-involved/post-content/Apps';

class GetInvolvedDetail extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    breadCrumb: PropTypes.array.isRequired,
    getInvolvedDetail: PropTypes.object.isRequired,
  };

  getPostContent(id, props = {}) {
    const pageNotFound = () => null;
    const pages = {
      'suggest-a-story': () => (
        <SuggestStoryPost {...props} />
      ),
      'contribute-data': () => <ContributeDataPostContent {...props} />,
      'join-the-community': () => <JoinCommunityPostContent {...props} />,
      'develop-your-app': () => <DevelopYourAppPostContent {...props} />,
      apps: () => <AppsPostContent {...props} />,
    };

    return pages[id] || pageNotFound;
  }

  render() {
    const {
      getInvolvedDetail: { staticData: data },
      breadCrumb,
      routes: { query: { id } },
    } = this.props;

    if (!data) return null;

    const postContent = this.getPostContent(id, data);
    const descriptions = data.description && data.description.split('\n').filter((line) => line.length > 0);

    return (
      <Layout
        title={data.title || 'Get Involved'}
        description={data.summary || ''}
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

        {data.summary && (
          <section className="l-section -secondary">
            <header className="l-section-header">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12 large-7">
                    <h2>{data.summary}</h2>
                  </div>
                </div>
                {descriptions.length > 0 && (
                  <div className="row">
                    {descriptions.map((description) => (
                      <div className={`column small-${12 / descriptions.length}`}>
                        {description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </header>
          </section>
        )}

        <StaticContent {...data} />
        {postContent()}
      </Layout>
    );
  }
}

export default GetInvolvedDetail;
