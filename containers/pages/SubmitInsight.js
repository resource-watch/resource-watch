import { connect } from 'react-redux';
import SubmitInsight from 'components/pages/SubmitInsight';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.submitInsight
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmitInsight);
