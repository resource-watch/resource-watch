import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DatasetsTable from 'components/datasets/table/DatasetsTable';

function DatasetsIndex(props) {
  return (
    <div className="c-datasets-index">
      <DatasetsTable
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
