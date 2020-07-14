import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import ReadMore from 'components/ui/read-more';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';
import { logEvent } from 'utils/analytics';

// Explore detail components
import ExploreDetailHeader from './explore-detail-header';
import ExploreDetailFooter from './explore-detail-footer';
import FurtherInformation from './further-information';
import ExploreDetailButtons from './explore-detail-buttons';
import ExploreDetailTags from './explore-detail-tags';
import DatasetLayers from './dataset-layers';
import RelatedContent from './related-content';
import ExploreDetailVisualization from './explore-detail-visualization';

// Constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from './constants';

// Styles
import './styles.scss';

class ExploreDetailComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object,
    datasetLoading: PropTypes.bool.isRequired,
    tags: PropTypes.array.isRequired,
    setSidebarAnchor: PropTypes.func.isRequired
  };

  static defaultProps = { dataset: null };

  // We clear the anchor value so that next time the component is open
  // the scroll is at the top
  componentWillUnmount() {
    this.props.setSidebarAnchor(null);
  }

  render() {
    const { dataset, datasetLoading, tags } = this.props;
    const metadata = dataset && dataset.metadata &&
      dataset.metadata.length > 0 && dataset.metadata[0];
    const info = metadata && metadata.info;
    const layers = dataset && dataset.layer;
    const dateLastUpdated = getDateConsideringTimeZone(dataset && dataset.dataLastUpdated);
    const defaultWidget = dataset && dataset.widget && dataset.widget.find(w => w.default === 'true');
    const showLayersSection = dataset && dataset.layer && dataset.layer.length > 0;
    const showTags = tags && tags.length > 0;

    return (
      <div className="c-explore-detail">
        <Spinner isLoading={datasetLoading} className="-light" />
        { metadata &&
          <Fragment>
            <div className="content">
              <ExploreDetailHeader dataset={dataset} />
              <div id="overview" className="overview metadata-section">
                <div className="title">
                  <h2>{info && info.name}</h2>
                </div>
                <div className="source-date">
                  <div className="source" title={metadata.source} >
                    {`SOURCE: ${metadata.source}`}
                  </div>
                  <div className="date">
                    {dateLastUpdated ? `UPDATED ON ${dateLastUpdated}`.toUpperCase() : ''}
                  </div>
                </div>
                <div className="functions">
                  {info && info.functions}
                </div>
                <ExploreDetailButtons dataset={dataset} />
                <div className="description">
                  <ReadMore
                    markdown
                    text={metadata.description}
                    limitChar={DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS}
                    readMoreClicked={() => logEvent('Explore (Detail)', 'Clicks Read More', 'description')}
                  />
                </div>
                {showTags &&
                  <ExploreDetailTags tags={tags} />
                }
              </div>
              {showLayersSection &&
                <div id="layers" className="metadata-section">
                  <DatasetLayers layers={layers} dataset={dataset} />
                </div>
              }
              <div id="visualization" className="metadata-section">
                <ExploreDetailVisualization
                  datasetId={dataset.id}
                  widgetId={defaultWidget && defaultWidget.id}
                />
              </div>
              <div id="further_information" className="metadata-section">
                <FurtherInformation metadata={metadata} />
              </div>
              <div id="related_content" className="metadata-section">
                <RelatedContent datasetID={dataset.id} />
              </div>
            </div>
            <ExploreDetailFooter />
          </Fragment>
        }
        {!metadata && !datasetLoading &&
          <div className="content">
            <ExploreDetailHeader dataset={dataset} />
            <div id="overview" className="overview metadata-section">
              <p>Metadata for this dataset couldn&apos;t be loaded.</p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ExploreDetailComponent;
