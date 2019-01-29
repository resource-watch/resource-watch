import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import compact from 'lodash/compact';
import flatten from 'lodash/flatten';

// components
import Layout from 'layout/layout/layout-app';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';
import RelatedTools from 'components/tools/related-tools';
import TopicDetailHeader from 'layout/topics-detail/topics-detail-header';
import TopicDetailContent from 'layout/topics-detail/topics-detail-content';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import Title from 'components/ui/Title';

// utils
import { TOPICS_CONNECTIONS } from 'utils/topics';

class TopicDetailLayout extends PureComponent {
  static propTypes = { topicsDetail: PropTypes.object.isRequired };

  getDatasetIds() {
    const { topicsDetail: { content } } = this.props;

    const parsedContent = JSON.parse(content);

    const datasetIds = parsedContent.map((block) => {
      if (!block) {
        return null;
      }

      if (block.type === 'widget') {
        return block.content.datasetId;
      }

      if (block.type === 'grid') {
        return block.content.map((b) => {
          if (!b) {
            return null;
          }

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
    const { topicsDetail: { name, description, slug } } = this.props;

    const datasetsIds = this.getDatasetIds();
    const toolsIds = TOPICS_CONNECTIONS
      .filter(t => t.topic === slug)
      .map(v => v.appId);

    return (
      <Layout
        title={name}
        description={description || ''}
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

          <div className="l-section -small">
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
                    onSelect={({ slug: _slug }) => {
                      // We need to make an amendment in the Wysiwyg to have this working
                      Router.pushRoute('topics_detail', { id: _slug })
                        .then(() => { window.scrollTo(0, 0); });
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

export default TopicDetailLayout;
