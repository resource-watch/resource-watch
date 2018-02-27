import { connect } from 'react-redux';

import NewsletterModalComponent from './component';


export default connect(
  state => ({
    ...state.shareModal
  }),
  null
)(NewsletterModalComponent);
