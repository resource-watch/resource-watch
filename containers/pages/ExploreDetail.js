import { connect } from 'react-redux';
import ExploreDetail from 'components/pages/ExploreDetail';
import { getDataset, resetDataset, getSimilarDatasets, toggleLayerShown } from 'redactions/exploreDetail';
import updateLayersShown from 'selectors/explore/layersShownExploreDetail';

const mapStateToProps = state => ({
  exploreDetail: state.exploreDetail,
  layersShown: updateLayersShown(state)
});

export default connect(mapStateToProps,
  { getDataset, resetDataset, getSimilarDatasets, toggleLayerShown })(ExploreDetail);
