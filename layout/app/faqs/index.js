import { connect } from 'react-redux';

// component
import LayoutFaqs from './component';

export default connect(
  state => ({ faqs: state.faqs.list }),
  null
)(LayoutFaqs);
