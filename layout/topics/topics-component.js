/* eslint max-len: 0 */
import React from 'react';

import { Router } from 'routes';

// Components
import Layout from 'layout/layout/layout-app';
import TopicThumbnailList from 'components/topics/thumbnail-list';

class TopicsComponent extends React.PureComponent {
  render() {
    return (
      <Layout
        title="Topics"
        description="Resource Watch Topics"
        className="page-topics"
        pageHeader
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>Topics</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <TopicThumbnailList
                  onSelect={({ slug }) => {
                    // We need to make an amendment in the Wysiwyg to have this working
                    Router.pushRoute('topics_detail', { id: slug })
                      .then(() => {
                        window.scrollTo(0, 0);
                      });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default TopicsComponent;
