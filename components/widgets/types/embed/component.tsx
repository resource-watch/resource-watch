import { useState, useMemo, useCallback } from 'react';
import classnames from 'classnames';

import Spinner from 'components/ui/Spinner';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';
import WidgetCaption from '../../caption';

import { APIWidgetSpec } from 'types/widget';

export interface EmbedTypeWidgetProps {
  widget: APIWidgetSpec;
  isFetching: boolean;
  isInACollection: boolean;
  iframeProps?: Partial<HTMLIFrameElement>;
  onToggleShare: (show: boolean) => void;
}

const EmbedTypeWidget = ({
  widget,
  isFetching,
  isInACollection,
  iframeProps = {},
  onToggleShare,
}: EmbedTypeWidgetProps): JSX.Element => {
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const handleShareToggle = useCallback(() => {
    onToggleShare(true);
  }, [onToggleShare]);

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  return (
    <div>
      {isFetching && <Spinner isLoading className="-transparent" />}
      {!isFetching && (
        <>
          <div className="p-4 border border-b-0 rounded-tl rounded-tr widget-header-container border-gray-light">
            <WidgetHeader
              widget={widget}
              onToggleInfo={handleInfoToggle}
              onToggleShare={handleShareToggle}
              isInACollection={isInACollection}
              isInfoVisible={isInfoWidgetVisible}
            />
          </div>
          <div
            className={classnames(
              'relative flex h-full overflow-x-auto overflow-y-hidden widget-container grow',
              {
                'border-0': !isInfoWidgetVisible,
                'border border-gray-light': isInfoWidgetVisible,
                'rounded-none': caption,
              },
            )}
            style={{
              height: 400,
            }}
          >
            {isInfoWidgetVisible && widget && !isFetching && (
              <WidgetInfo widget={widget} className="p-4" />
            )}
            <iframe
              title={`${widget.name} || Resource Watch`}
              src={widget.widgetConfig.url}
              width="100%"
              height="100%"
              frameBorder="0"
              {...iframeProps}
            />
          </div>
          {caption && <WidgetCaption text={caption} />}
        </>
      )}
    </div>
  );
};

export default EmbedTypeWidget;
