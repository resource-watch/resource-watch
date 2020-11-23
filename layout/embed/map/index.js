import { connect } from 'react-redux';

// selectors
import {
  getWidget,
  getIsLoading,
  getIsError,
  getMapProps,
  embedWidgetMapGetUpdatedLayerGroups,
  embedWidgetMapGetUpdatedLayers,
  embedWidgetMapGetActiveInteractiveLayers,
} from './selectors';

// component
import LayoutEmbedMap from './component';

export default connect(
  (state, props) => ({
    widget: getWidget(state, props),
    isLoading: getIsLoading(state, props),
    isError: getIsError(state, props),
    user: state.user,
    mapProps: getMapProps(state, props),
    activeLayers: embedWidgetMapGetUpdatedLayers(state, props),
    layerGroups: embedWidgetMapGetUpdatedLayerGroups(state, props),
    activeInteractiveLayers: embedWidgetMapGetActiveInteractiveLayers(state, props),
  }),
  null,
)(LayoutEmbedMap);
