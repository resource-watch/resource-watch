/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import flatten from 'lodash/flatten';

import { Router } from 'routes';

// Utils
import { TOPICS_CONNECTIONS } from 'utils/topics';

// Components
import Layout from 'layout/layout/layout-app';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import RelatedTools from 'components/tools/related-tools';

// Topic Detail Component
import TopicDetailHeader from 'layout/topics-detail/topics-detail-header';
import TopicDetailContent from 'layout/topics-detail/topics-detail-content';
import TopicThumbnailList from 'components/topics/thumbnail-list';

import Title from 'components/ui/Title';

class TopicDetailComponent extends React.Component {
  static propTypes = {
    topicsDetail: PropTypes.object
  };

  getDatasetIds() {
    const { topicsDetail } = this.props;

    const content = JSON.parse(topicsDetail.data.content);

    const datasetIds = content.map((block) => {
      if (block.type === 'widget') {
        return block.content.datasetId;
      }

      if (block.type === 'grid') {
        return block.content.map((b) => {
          if (b.type === 'widget') {
            return b.content.datasetId;
          }

          return null;
        });
      }

      return null;
    });

    return compact(flatten(datasetIds));
  }

  render() {
    const {
      topicsDetail
    } = this.props;

    const { data: topic } = topicsDetail;

    const datasetsIds = this.getDatasetIds();
    const toolsIds = TOPICS_CONNECTIONS
      .filter(t => t.topic === topic.slug)
      .map(v => v.appId);

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

          <div className="l-section -small">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <Title className="-extrabig -secondary -p-secondary">
                    Other topics
                  </Title>

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

          <div className="l-section -small">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <Title className="-extrabig -secondary -p-secondary">
                    Similar datasets
                  </Title>

                  <SimilarDatasets
                    datasetIds={datasetsIds}
                    onTagSelected={this.handleTagSelected}
                  />
                </div>
              </div>
            </div>
          </div>

          {!!toolsIds.length &&
            <div className="l-section -small">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <Title className="-extrabig -secondary -p-secondary">
                      Related tools
                    </Title>

                    <RelatedTools
                      active={toolsIds}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </Layout>
    );
  }
}

export default TopicDetailComponent;
