import { connect } from 'react-redux';

// component
import PartnersShow from './component';

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(PartnersShow);
