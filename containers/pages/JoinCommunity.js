import { connect } from 'react-redux';
import JoinCommunity from 'components/pages/JoinCommunity';
import { getStaticData } from 'redactions/static_pages';

const mapStateToProps = state => ({
  data: state.staticPages.joinCommunity
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinCommunity);
