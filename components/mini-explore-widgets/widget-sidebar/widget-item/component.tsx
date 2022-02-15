import Renderer from '@widget-editor/renderer';

// components
import WidgetHeader from 'components/widgets/header';
import Spinner from 'components/ui/Spinner';
import WidgetShareModal from 'components/widgets/share-modal';
import WidgetInfo from 'components/widgets/info';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

// types
import type { MouseEvent } from 'react';
import type { UseQueryResult } from 'react-query';
import type { Adapter } from '@widget-editor/types';
import type { APIWidgetSpec } from 'types/widget';

export default function WidgetItem({
  widgetState,
  adapter,
  params,
  isInACollection,
  isInfoVisible,
  isShareVisible,
  handleInfoToggle,
  handleShareToggle,
  handleCloseShareWidget,
}: {
  adapter: Adapter.Service;
  isInACollection: boolean;
  isInfoVisible: boolean;
  isShareVisible: boolean;
  params: Record<string, string | number>;
  widgetState: UseQueryResult<APIWidgetSpec | Partial<APIWidgetSpec>, Error>;
  handleInfoToggle: (evt: MouseEvent<HTMLButtonElement>) => void;
  handleShareToggle: (widget: APIWidgetSpec) => void;
  handleCloseShareWidget: () => void;
}): JSX.Element {
  return (
    <>
      <div className="widget-item">
        {widgetState.isFetching && <Spinner isLoading className="-transparent" />}
        {!widgetState.isFetching && !widgetState.isError && (
          <>
            <WidgetHeader
              widget={widgetState.data}
              params={params}
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
              {isInfoVisible && widgetState.data && (
                <WidgetInfo widget={widgetState.data as APIWidgetSpec} />
              )}
            </div>
          </>
        )}
      </div>
      {isShareVisible && (
        <WidgetShareModal
          isVisible
          widget={widgetState.data}
          params={params}
          onClose={handleCloseShareWidget}
        />
      )}
    </>
  );
}
