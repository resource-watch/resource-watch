import { connect } from 'react-redux';
import DevelopApp from 'components/pages/DevelopApp';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.developApp
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DevelopApp);
