import { connect } from 'react-redux';
import PartnerDetail from 'components/pages/PartnerDetail';
import { getPartnerData } from 'redactions/partnerDetail';

const mapStateToProps = state => ({
  data: state.partnerDetail.data
});

const mapDispatchToProps = dispatch => ({
  getPartnerData: (id) => { dispatch(getPartnerData(id)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerDetail);
