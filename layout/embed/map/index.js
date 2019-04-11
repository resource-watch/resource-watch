import { connect } from 'react-redux';

// actions
import {
  getWidget,
  toggleLayerGroupVisibility,
  checkIfFavorited,
  setIfFavorited
} from 'redactions/widget';

// component
import LayoutEmbedMap from './component';

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    layerGroups: state.widget.layerGroups,
    zoom: state.widget.zoom,
    favourited: state.widget.favourite.favourited,
    latLng: state.widget.latLng,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    toggleLayerGroupVisibility,
    checkIfFavorited,
    setIfFavorited
  }
)(LayoutEmbedMap);
