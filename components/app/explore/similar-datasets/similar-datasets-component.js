import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {
  render() {
    const { similarDatasets } = this.props;
    const { loading, data, error } = similarDatasets;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />
        <h3>Similar datasets</h3>
        {data && data.length > 0 &&
          <DatasetList
            active={[]}
            list={data}
            mode="grid"
            showActions={false}
            showFavorite={false}
            onTagSelected={this.props.onTagSelected}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  similarDatasets: state.similarDatasets
});

SimilarDatasets.propTypes = {
  // Callbacks
  onTagSelected: PropTypes.func,
  // Store
  similarDatasets: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(SimilarDatasets);
