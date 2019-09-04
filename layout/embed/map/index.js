import { connect } from 'react-redux';

// actions
import { checkIfFavorited, setIfFavorited } from 'redactions/widget';

// selectors
import { getMapProps, getUpdatedLayers, getActiveInteractiveLayers } from './selectors';

// component
import LayoutEmbedMap from './component';

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    favourited: state.widget.favourite.favourited,
    user: state.user,
    webshot: state.common.webshot,
    mapProps: getMapProps(state),
    activeLayers: getUpdatedLayers(state),
    layerGroups: state.widget.layerGroups,
    activeInteractiveLayers: getActiveInteractiveLayers(state)
  }),
  {
    checkIfFavorited,
    setIfFavorited
  }
)(LayoutEmbedMap);
