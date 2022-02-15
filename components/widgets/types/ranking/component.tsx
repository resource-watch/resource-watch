import { useState, useCallback, useMemo } from 'react';

// components
import Spinner from 'components/ui/Spinner';
import WidgetHeader from '../../header';
import WidgetInfo from '../../info';
import WidgetCaption from '../../caption';

// types
import type { APIWidgetSpec } from 'types/widget';

export interface RankingData {
  x: string | number;
  ranking: string | number;
  count: string | number;
}

export interface RankingWidgetProps {
  widget: APIWidgetSpec;
  params?: Record<string, string | number | unknown>;
  data: RankingData;
  isFetching: boolean;
  isError: boolean;
  isInACollection: boolean;
  onToggleShare: (widget: APIWidgetSpec) => void;
}

const RankingWidget = ({
  widget,
  params,
  data,
  isFetching,
  isError,
  isInACollection,
  onToggleShare,
}: RankingWidgetProps): JSX.Element => {
  const [isInfoWidgetVisible, setInfoWidgetVisibility] = useState(false);

  const handleShareToggle = useCallback(() => {
    onToggleShare(widget);
  }, [onToggleShare, widget]);

  const handleInfoToggle = useCallback(() => {
    setInfoWidgetVisibility((infoWidgetVisibility) => !infoWidgetVisibility);
  }, []);

  const caption = useMemo(() => widget?.metadata?.[0]?.info?.caption, [widget]);

  return (
    <div>
      <div className="p-4 border border-b-0 rounded-tl rounded-tr border-gray-light">
        <WidgetHeader
          widget={widget}
          params={params}
          onToggleInfo={handleInfoToggle}
          onToggleShare={handleShareToggle}
          isInACollection={isInACollection}
          isInfoVisible={isInfoWidgetVisible}
        />
      </div>
      <div
        className="relative flex h-full p-4 overflow-x-auto overflow-y-hidden border grow border-gray-light"
        style={{
          height: 400,
        }}
      >
        {isFetching && <Spinner isLoading className="-transparent" />}
        {!isFetching && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            {data && (
              <>
                <h1 className="text-blue-light">{data.x}</h1>
                <div className="subtitle">
                  Rank <span className="text-lg font-bold">{data.ranking}</span>
                  {` of `}
                  {data.count} countries
                </div>
              </>
            )}
            {!isFetching && !data && !isError && <div className="no-data">No data available</div>}
            {isInfoWidgetVisible && widget && !isFetching && (
              <WidgetInfo widget={widget} className="p-4" />
            )}
          </div>
        )}
      </div>
      {caption && <WidgetCaption text={caption} />}
    </div>
  );
};

export default RankingWidget;
