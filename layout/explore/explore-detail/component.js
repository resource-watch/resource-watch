import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Widget Editor
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// Components
import Spinner from 'components/ui/Spinner';
import ReadMore from 'components/ui/read-more';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';
import DefaultTheme from 'utils/widgets/theme';

// Explore detail components
import ExploreDetailHeader from './explore-detail-header';
import ExploreDetailFooter from './explore-detail-footer';
import FurtherInformation from './further-information';
import ExploreDetailButtons from './explore-detail-buttons';
import ExploreDetailTags from './explore-detail-tags';
import DatasetLayers from './dataset-layers';
import RelatedContent from './related-content';

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

  onSaveWidget = (widget) => {
    console.log('onSaveWidget! ', widget);
  }

  render() {
    const { dataset, datasetLoading, tags } = this.props;
    const metadata = dataset && dataset.metadata &&
      dataset.metadata.length > 0 && dataset.metadata[0];
    const info = metadata && metadata.info;
    const layers = dataset && dataset.layer;
    const dateLastUpdated = getDateConsideringTimeZone(dataset && dataset.dataLastUpdated);
    const defaultWidget = dataset && dataset.widget && dataset.widget.find(w => w.default === 'true');
        
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
                {dataset &&
                  <WidgetEditor 
                    datasetId={dataset.id}
                    {...(defaultWidget && { widgetId: defaultWidget.id })}
                    compact={true}
                    application="rw"
                    onSave={this.onSaveWidget}
                    theme={DefaultTheme}
                    adapter={RwAdapter}
                    disable={['theme-selection', 'advanced-editor']}
                  />
                }
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
