import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DatasetsList from 'components/datasets/list/DatasetsList';

function DatasetsIndex(props) {
  return (
    <div className="c-datasets-index">
      <DatasetsList
        getDatasetsFilters={{
          userId: props.user.id
        }}
        routes={{
          index: 'myrw',
          detail: 'myrw_detail'
        }}
      />
    </div>
  );
}

DatasetsIndex.propTypes = {
  // Store
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DatasetsIndex);
