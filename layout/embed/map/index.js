import { connect } from 'react-redux';

// actions
import { checkIfFavorited, setIfFavorited } from 'redactions/widget';

// selectors
import {
  getMapProps,
  embedWidgetMapGetUpdatedLayerGroups,
  embedWidgetMapGetUpdatedLayers,
  embedWidgetMapGetActiveInteractiveLayers
} from './selectors';

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
    activeLayers: embedWidgetMapGetUpdatedLayers(state),
    layerGroups: embedWidgetMapGetUpdatedLayerGroups(state),
    activeInteractiveLayers: embedWidgetMapGetActiveInteractiveLayers(state)
  }),
  {
    checkIfFavorited,
    setIfFavorited
  }
)(LayoutEmbedMap);
