import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import ReadMore from 'components/ui/ReadMore';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';

// Explore detail components
import ExploreDetailHeader from './explore-detail-header';
import ExploreDetailFooter from './explore-detail-footer';
import FurtherInformation from './further-information';
import ExploreDetailButtons from './explore-detail-buttons';
import ExploreDetailTags from './explore-detail-tags';
import DatasetLayers from './dataset-layers';

// Constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from './constants';

// Styles
import './styles.scss';

class ExploreDetailComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object,
    datasetLoading: PropTypes.bool.isRequired,
    tags: PropTypes.array.isRequired,
    tagsLoading: PropTypes.bool.isRequired
  };

  static defaultProps = { dataset: null };

  render() {
    const { dataset, datasetLoading, tags } = this.props;
    const metadata = dataset && dataset.metadata && dataset.metadata[0];
    const info = metadata && metadata.info;
    const layers = dataset && dataset.layer;
    const dateLastUpdated = getDateConsideringTimeZone(dataset && dataset.dataLastUpdated);

    return (
      <div className="c-explore-detail">
        <Spinner isLoading={datasetLoading} className="-light" />
        { metadata &&
          <Fragment>
            <ExploreDetailHeader dataset={dataset} />
            <div className="content">
              <div id="overview" className="overview metadata-section">
                <div className="title">
                  <h2>{info && info.name}</h2>
                </div>
                <div className="source-date">
                  <div className="source" title={metadata.source} >
                    {metadata.source}
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
                  />
                </div>
                {tags && tags.length && tags.length > 0 &&
                  <ExploreDetailTags tags={tags} />
                }
              </div>
              <div id="layers" className="metadata-section">
                <DatasetLayers layers={layers} dataset={dataset} />
              </div>
              <div id="visualization" className="metadata-section">
                <h3>Customize visualization</h3>
              </div>
              <div id="further_information" className="metadata-section">
                <FurtherInformation metadata={metadata} />
              </div>
              <div id="related_content" className="metadata-section">
                <h3>Related content</h3>
              </div>
            </div>
            <ExploreDetailFooter />
          </Fragment>
        }
      </div>
    );
  }
}

export default ExploreDetailComponent;
