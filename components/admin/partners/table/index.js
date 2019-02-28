import { connect } from 'react-redux';

// actions
import {
  getPublishedPartners,
  setFilters
} from 'modules/partners/actions';

// selectors
import { getFilteredPartners } from './selectors';

// component
import AdminPartnersTable from './component';

export default connect(
  state => ({
    ...state.partners.published,
    list: getFilteredPartners(state)
  }),
  {
    getPublishedPartners,
    setFilters
  }
)(AdminPartnersTable);
