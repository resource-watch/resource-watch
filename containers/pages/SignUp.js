import { connect } from 'react-redux';
import SignUp from 'components/pages/SignUp';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.about
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => { dispatch(getStaticData(slug, ref)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
