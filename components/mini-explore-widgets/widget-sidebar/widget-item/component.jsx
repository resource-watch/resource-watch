import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

// components
import WidgetHeader from 'components/widgets/header';
import Spinner from 'components/ui/Spinner';
import WidgetShareModal from 'components/widgets/share-modal';
import WidgetInfo from 'components/widgets/info';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

export default function WidgetItem({
  widgetState,
  adapter,
  isInACollection,
  isInfoVisible,
  isShareVisible,
  handleInfoToggle,
  handleShareToggle,
  handleCloseShareWidget,
}) {
  return (
    <>
      <div className="widget-item">
        {widgetState.isFetching && <Spinner isLoading className="-transparent" />}
        {!widgetState.isFetching && !widgetState.isError && (
          <>
            <WidgetHeader
              widget={widgetState.data}
              onToggleInfo={handleInfoToggle}
              onToggleShare={handleShareToggle}
              isInACollection={isInACollection}
              isInfoVisible={isInfoVisible}
            />
            <div className="widget-container">
              <Renderer
                adapter={adapter}
                widgetConfig={widgetState.data.widgetConfig}
                map={WIDGET_EDITOR_MAPBOX_PROPS}
              />
              {isInfoVisible && widgetState.data && <WidgetInfo widget={widgetState.data} />}
            </div>
          </>
        )}
      </div>
      {isShareVisible && (
        <WidgetShareModal isVisible widget={widgetState.data} onClose={handleCloseShareWidget} />
      )}
    </>
  );
}

WidgetItem.propTypes = {
  widgetState: PropTypes.shape({
    data: PropTypes.shape({
      name: PropTypes.string,
      widgetConfig: PropTypes.shape({}),
    }),
    isFetching: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
  }).isRequired,
  isInACollection: PropTypes.bool.isRequired,
  isShareVisible: PropTypes.bool.isRequired,
  isInfoVisible: PropTypes.bool.isRequired,
  adapter: PropTypes.func.isRequired,
  handleInfoToggle: PropTypes.func.isRequired,
  handleShareToggle: PropTypes.func.isRequired,
  handleCloseShareWidget: PropTypes.func.isRequired,
};
