import { connect } from 'react-redux';

// actions
import {
  getAllPartners,
  setFilters,
} from 'modules/partners/actions';

// selectors
import { getFilteredPartners } from './selectors';

// component
import AdminPartnersTable from './component';

export default connect(
  (state) => ({
    ...state.partners.all,
    list: getFilteredPartners(state),
  }),
  {
    getAllPartners,
    setFilters,
  },
)(AdminPartnersTable);
