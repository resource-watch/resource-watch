/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-app';

// Topic Detail Component
import TopicDetailHeader from 'pages/app/topic-detail/topic-detail-header';
import TopicDetailContent from 'pages/app/topic-detail/topic-detail-content';

class TopicDetailComponent extends Page {
  static propTypes = {
    topicDetail: PropTypes.object
  };

  render() {
    const {
      topicDetail
    } = this.props;

    const { data: topic } = topicDetail;

    return (
      <Layout
        title={topic.name}
        description={topic.description || ''}
        category="Topic"
        pageHeader
      >
        <div className="c-page-explore-detail">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <TopicDetailHeader />
                </div>
              </div>
            </div>
          </div>

          <div className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <TopicDetailContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default TopicDetailComponent;
