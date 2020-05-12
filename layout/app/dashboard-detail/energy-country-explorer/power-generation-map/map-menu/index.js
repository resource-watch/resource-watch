import { connect } from 'react-redux';

import MapMenuComponent from './component';

export default connect(state => (
  { responsive: state.responsive }),
null)(MapMenuComponent);
