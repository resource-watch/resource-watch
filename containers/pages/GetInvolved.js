import { connect } from 'react-redux';
import GetInvolved from 'components/pages/GetInvolved';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.getInvolved
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GetInvolved);
