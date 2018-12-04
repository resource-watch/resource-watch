
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { getPartners } from 'redactions/admin/partners';

// selectors
import { getFilteredPartners } from './selectors';

// component
import PartnersPage from './component';

export default withRedux(
  initStore,
  state => ({ allPartners: getFilteredPartners(state) }),
  { getPartners }
)(PartnersPage);
