import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {

  componentWillUnmount() {
    this.props.resetSimilarDatasets();
  }

  render() {
    const { similarDatasets, active } = this.props;
    const { loading, data, error } = similarDatasets;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />
        <h3>Similar datasets</h3>
        {data && data.length > 0 &&
          <DatasetList
            active={active}
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

SimilarDatasets.defaultProps = {
  active: []
};

SimilarDatasets.propTypes = {
  active: PropTypes.array,
  // Callbacks
  onTagSelected: PropTypes.func,
  // Store
  similarDatasets: PropTypes.object.isRequired,
  resetSimilarDatasets: PropTypes.func.isRequired
};

export default connect(mapStateToProps, null)(SimilarDatasets);
