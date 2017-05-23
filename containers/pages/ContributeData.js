import { connect } from 'react-redux';
import ContributeData from 'components/pages/ContributeData';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.contributeData
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContributeData);
