import React from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import ExploreDetailHeader from './explore-detail-header';

// Styles
import './styles.scss';

class ExploreDetailComponent extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  };


  render() {
    const { dataset, loading } = this.props;
    const metadata = dataset && dataset.metadata && dataset.metadata[0];

    return (
      <div className="c-explore-detail">
        <Spinner isLoading={loading} className="-light" />
        <ExploreDetailHeader />
        <div className="row">
          <div className="column small-12">
            <div className="title">
              <h2>{metadata && metadata.info.name}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExploreDetailComponent;
