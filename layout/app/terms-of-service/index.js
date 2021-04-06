import { connect } from 'react-redux';

import LayoutTermsOfService from './component';

export default connect(
  (state) => ({ data: state.staticPages['terms-of-service'] }),
  null,
)(LayoutTermsOfService);
