import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// component
import NewsletterPage from './component';

export default withRedux(
  initStore
)(NewsletterPage);
