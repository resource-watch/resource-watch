import { connect } from 'react-redux';
// Actions
import { setLayerGroupOpacity } from 'redactions/explore';

import LegendComponent from './legend-component';

export default connect(
  state => ({
    ...state.trySubscriptionModal
  }),
  {
    setLayerGroupOpacity
  }
)(LegendComponent);
