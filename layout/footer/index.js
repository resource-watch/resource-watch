import { connect } from 'react-redux';

// selectors
import { getFeaturedPartners, getMenu } from './selectors';

// component
import Footer from './component';

export default connect(
  state => ({
    partners: getFeaturedPartners(state),
    menu: getMenu()
  }),
  null
)(Footer);
