import { connect } from 'react-redux';

// actions
import { setSources, resetSources } from 'redactions/admin/sources';

// component
import DatasetMetadataForm from './component';

export default connect(
  (state) => ({ user: state.user }),
  {
    setSources,
    resetSources,
  },
)(DatasetMetadataForm);
