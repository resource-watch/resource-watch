import { connect } from 'react-redux';

// component
import FaqsPage from './component';

export default connect(
  state => ({ faqs: state.faqs.list }),
  null
)(FaqsPage);
