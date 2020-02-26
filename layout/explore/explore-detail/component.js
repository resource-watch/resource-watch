import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import ReadMore from 'components/ui/ReadMore';
import ExploreDetailHeader from './explore-detail-header';
import ExploreDetailFooter from './explore-detail-footer';
import FurtherInformation from './further-information';
import ExploreDetailButtons from './explore-detail-buttons';
import DatasetLayers from './dataset-layers';

// Constants
import { DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS } from './constants';

// Styles
import './styles.scss';

class ExploreDetailComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  static defaultProps = { dataset: null };

  render() {
    const { dataset, loading } = this.props;
    const metadata = dataset && dataset.metadata && dataset.metadata[0];
    const info = metadata && metadata.info;
    const layers = dataset && dataset.layer;

    return (
      <div className="c-explore-detail">
        <Spinner isLoading={loading} className="-light" />
        { metadata &&
          <Fragment>
            <ExploreDetailHeader dataset={dataset} />
            <div className="content">
              <div className="row">
                <div className="column small-12">
                  <div id="overview" className="explore-detail-section">
                    <div className="title">
                      <h2>{info && info.name}</h2>
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
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div id="layers" className="explore-detail-section">
                    <DatasetLayers layers={layers} dataset={dataset} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div id="visualization" className="explore-detail-section">
                    <h3>Customize visualization</h3>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div id="further_information" className="explore-detail-section">
                    <FurtherInformation metadata={metadata} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <div id="related_content" className="explore-detail-section">
                    <h3>Related content</h3>
                  </div>
                </div>
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
