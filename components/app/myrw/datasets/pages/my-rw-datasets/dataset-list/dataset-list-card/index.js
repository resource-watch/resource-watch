import { connect } from 'react-redux';

// actions
import { getDatasetsByTab } from 'redactions/admin/datasets';

// component
import DatasetListCard from './component';

export default connect(
  (state) => ({ user: state.user }),
  {
    getDatasetsByTab,
  },
)(DatasetListCard);
