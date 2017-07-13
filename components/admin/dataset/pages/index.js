import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import DatasetTable from 'components/admin/dataset/table/DatasetTable';

function DatasetIndex(props) {
  const { user } = props;

  return (
    <div className="c-partners-index">
      <DatasetTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

DatasetIndex.propTypes = {
  user: PropTypes.object.isRequired
};

DatasetIndex.defaultProps = {

};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(DatasetIndex);
