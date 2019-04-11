import { connect } from 'react-redux';

// selectors
import { getFilteredPartners } from './selectors';

// component
import LayoutPartners from './component';

export default connect(
  state => ({ allPartners: getFilteredPartners(state) }),
  null
)(LayoutPartners);
