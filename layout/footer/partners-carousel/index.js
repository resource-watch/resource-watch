import { connect } from 'react-redux';

// selectors
import { getFeaturedPartners } from './selectors';

// component
import PartnersCarousel from './component';

export default connect(
  (state) => ({
    partners: getFeaturedPartners(state),
  }),
  null,
)(PartnersCarousel);
