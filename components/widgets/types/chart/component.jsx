import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Renderer from '@widget-editor/renderer';

// components
import Spinner from 'components/ui/Spinner';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

export default function ChartType({
  widget,
  adapter,
  style,
  isEmbed,
  isWebshot,
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

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  return (
    <div className={classnames('c-widget', { '-is-embed': isEmbed })} style={style}>
      {!isFetching && !isError && !isWebshot && (
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

      <div
        className="widget-container"
        style={{
          padding: 15,
          ...(caption && {
            borderBottom: 0,
            borderRadius: 0,
            boxShadow: 'none',
          }),
        }}
      >
        {isFetching && <Spinner isLoading className="-transparent" />}
        {!isFetching && !isError && (
          <Renderer
            adapter={adapter}
            widgetConfig={widget.widgetConfig}
            map={WIDGET_EDITOR_MAPBOX_PROPS}
          />
        )}
        {isInfoWidgetVisible && widget && !isFetching && (
          <WidgetInfo
            widget={widget}
            style={{
              padding: 15,
            }}
          />
        )}
      </div>
      {caption && <div className="widget-caption-container">{caption}</div>}
    </div>
  );
}

ChartType.defaultProps = {
  isFetching: false,
  isError: false,
  isInACollection: false,
  style: {},
  isEmbed: false,
  isWebshot: false,
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
  isEmbed: PropTypes.bool,
  isWebshot: PropTypes.bool,
  isFetching: PropTypes.bool,
  isError: PropTypes.bool,
  isInACollection: PropTypes.bool,
  onToggleShare: PropTypes.func.isRequired,
};
