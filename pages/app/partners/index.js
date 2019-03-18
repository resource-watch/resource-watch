import { connect } from 'react-redux';

// selectors
import { getFilteredPartners } from './selectors';

// component
import PartnersPage from './component';

export default connect(
  state => ({ allPartners: getFilteredPartners(state) }),
  null
)(PartnersPage);
