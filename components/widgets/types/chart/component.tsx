import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Renderer from '@widget-editor/renderer';

// components
import Spinner from 'components/ui/Spinner';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';
import WidgetCaption from '../../caption';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

import type { APIWidgetSpec } from 'types/widget';
import type { ChartContainerProps } from './index';

export interface ChartTypeProps extends Omit<ChartContainerProps, 'widgetId'> {
  widget: APIWidgetSpec;
  adapter: () => void;
  isFetching: boolean;
  isError: boolean;
  isInACollection: boolean;
}

const ChartType = ({
  widget,
  adapter,
  style,
  isEmbed,
  isWebshot,
  isFetching,
  isError,
  isInACollection,
  onToggleShare,
}: ChartTypeProps): JSX.Element => {
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(true);
  }, [onToggleShare]);

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  return (
    <div className={classnames('c-widget', { '-is-embed': isEmbed })} style={style}>
      {!isFetching && !isError && !isWebshot && (
        <div className="p-4 border border-b-0 rounded-tl rounded-tr widget-header-container border-gray-light">
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
        className="relative flex h-full p-4 overflow-x-auto overflow-y-hidden border widget-container grow border-gray-light"
        style={{
          height: 400,
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
          <WidgetInfo widget={widget} className="p-4" />
        )}
      </div>
      {caption && <WidgetCaption text={caption} />}
    </div>
  );
};

export default ChartType;

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
