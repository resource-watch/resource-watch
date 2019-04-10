import { connect } from 'react-redux';

// component
import LayoutPartnerDetail from './component';

export default connect(
  state => ({
    partner: state.partners.detail.data,
    datasets: state.partners.datasetsByPartner.data
  }),
  null
)(LayoutPartnerDetail);
