import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import ReadMore from 'components/ui/ReadMore';
import ExploreDetailHeader from './explore-detail-header';
import ExploreDetailFooter from './explore-detail-footer';
import FurtherInformation from './further-information';

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

    return (
      <div className="c-explore-detail">
        <Spinner isLoading={loading} className="-light" />
        { metadata &&
          <Fragment>
            <ExploreDetailHeader />
            <div className="content">
              <div id="overview" className="overview metadata-section">
                <div className="title">
                  <h2>{metadata.info && metadata.info.name}</h2>
                </div>
                <div className="source-date">
                  {metadata.source}
                </div>
                <div className="functions">
                  {metadata.info && metadata.info.functions}
                </div>
                <div className="buttons" />
                <div className="description">
                  <ReadMore
                    markdown
                    text={metadata.description}
                    limitChar={DEFAULT_LIMIT_CHAR_FOR_METADATA_FIELDS}
                  />
                </div>
              </div>
              <div id="layers" className="row">
                <div className="column small-12">
                  <h3>Dataset layers</h3>
                </div>
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
