/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Explore Detail Component
import ExploreDetailHeader from 'layout/explore-detail/explore-detail-header';
import ExploreDetailInfo from 'layout/explore-detail/explore-detail-info';
import ExploreDetailRelatedTools from 'layout/explore-detail/explore-detail-related-tools';
import ExploreDetailButtons from 'layout/explore-detail/explore-detail-buttons';
import ExploreDetailTags from 'layout/explore-detail/explore-detail-tags';
import ExploreDetailWidgetEditor from 'layout/explore-detail/explore-detail-widget-editor';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

import Title from 'components/ui/Title';
import ReadMore from 'components/ui/ReadMore';
import Banner from 'components/app/common/Banner';

import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';

// Utils
import {
  getDatasetMetadata,
  getDatasetName
} from 'layout/explore-detail/explore-detail-helpers';

class ExploreDetail extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object
  };

  render() {
    const {
      exploreDetail
    } = this.props;

    const dataset = exploreDetail.data;
    const datasetName = getDatasetName(dataset);
    const metadata = getDatasetMetadata(dataset);

    return (
      <Layout
        title={datasetName}
        description={metadata.description || ''}
        category="Dataset"
        pageHeader
      >
        <div className="c-page-explore-detail">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <ExploreDetailHeader />
                </div>
              </div>
            </div>
          </div>

          {/* DATASET INFO && ACTIONS */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12 large-7">
                  {/* Function */}
                  <ReadMore
                    text={metadata.description}
                  />
                </div>

                <div className="column small-12 large-4 large-offset-1">
                  <ExploreDetailButtons />
                </div>
              </div>
            </div>
          </section>

          {/* WIDGET EDITOR */}
          <ExploreDetailWidgetEditor />

          {/* METADATA */}
          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <ExploreDetailInfo />
                </div>
              </div>

              <div className="row">
                <div className="column small-12">
                  {/* TAGS SECTION */}
                  <h3>Tags</h3>
                  <ExploreDetailTags />
                </div>
              </div>
            </div>
          </section>

          <section className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  {/* SIMILAR DATASETS */}
                  <div className="similar-datasets">
                    <div className="row">
                      <div className="column small-12">
                        <Title className="-extrabig -secondary -p-secondary">
                          Similar datasets
                        </Title>

                        <SimilarDatasets
                          datasetIds={[dataset.id]}
                          onTagSelected={this.handleTagSelected}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RELATED TOOLS */}
          {exploreDetail.tools.active.length > 0 &&
            <section className="l-section">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <div className="related-tools">
                      <div className="row">
                        <div className="column small-12">
                          <Title className="-extrabig -secondary -p-secondary">
                            Related tools
                          </Title>

                          <ExploreDetailRelatedTools />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          }

          <aside className="l-postcontent">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12">
                  <Banner className="partners -text-center">
                    <p className="-claim">Take the pulse of our planet.</p>
                    <a href="/data/pulse" className="c-button -primary -alt">Launch Planet Pulse</a>
                  </Banner>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </Layout>
    );
  }
}

export default ExploreDetail;
