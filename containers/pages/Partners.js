import { connect } from 'react-redux';
import Partners from 'components/pages/Partners';
import { getPartners } from 'redactions/partners';

const mapStateToProps = state => ({
  list: state.partners.list
});

const mapDispatchToProps = dispatch => ({
  getPartners: () => { dispatch(getPartners()); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Partners);
