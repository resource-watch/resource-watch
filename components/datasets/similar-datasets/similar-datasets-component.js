import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DatasetList from 'components/app/explore/DatasetList';
import Spinner from 'components/ui/Spinner';

class SimilarDatasets extends PureComponent {
  render() {
    const { similarDatasets, active } = this.props;
    const { loading, data } = similarDatasets;

    return (
      <div className="c-similar-datasets">
        <Spinner isLoading={loading} className="-light" />

        {!loading && !data.length &&
          <p>No data available</p>
        }

        {!!data.length &&
          <DatasetList
            active={active}
            list={data}
            mode="grid"
            showActions={false}
            showFavorite
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
  similarDatasets: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(SimilarDatasets);
