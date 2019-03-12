import { connect } from 'react-redux';

// component
import PagesShow from './component';

export default connect(
  state => ({
    user: state.user,
    id: state.routes.query.id
  }),
  null
)(PagesShow);
