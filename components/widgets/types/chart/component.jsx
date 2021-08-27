import {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

// components
import InView from 'components/in-view';
import Spinner from 'components/ui/Spinner';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';

export default function ChartType({
  widget,
  adapter,
  style,
  isFetching,
  isError,
  isInACollection,
  onToggleShare,
}) {
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const caption = widget?.metadata?.[0]?.info?.caption;

  return (
    <div
      className="c-widget"
      style={style}
    >
      {!isFetching && !isError && (
        <div className="widget-header-container">
          <WidgetHeader
            widget={widget}
            onToggleInfo={handleInfoToggle}
            onToggleShare={handleShareToggle}
            isInACollection={isInACollection}
            isInfoVisible={isInfoWidgetVisible}
          />
        </div>
      )}

      <InView
        triggerOnce
        threshold={0.25}
      >
        {({ ref, inView }) => (
          <div
            className="widget-container"
            ref={ref}
            style={{
              padding: 15,
            }}
          >
            {isFetching && (
              <Spinner
                isLoading
                className="-transparent"
              />
            )}
            {!isFetching && !isError && inView && (
              <Renderer
                adapter={adapter}
                widgetConfig={widget.widgetConfig}
              />
            )}
            {(isInfoWidgetVisible && widget && !isFetching) && (
              <WidgetInfo
                widget={widget}
                style={{
                  padding: 15,
                }}
              />
            )}
          </div>
        )}
      </InView>
      {caption && (
        <div className="widget-caption-container">
          {caption}
        </div>
      )}
    </div>
  );
}

ChartType.defaultProps = {
  isFetching: false,
  isError: false,
  isInACollection: false,
  style: {},
};

ChartType.propTypes = {
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({}),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          caption: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  adapter: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  isFetching: PropTypes.bool,
  isError: PropTypes.bool,
  isInACollection: PropTypes.bool,
  onToggleShare: PropTypes.func.isRequired,
};
