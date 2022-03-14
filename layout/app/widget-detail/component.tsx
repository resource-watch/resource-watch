import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { replace } from '@vizzuality/layer-manager-utils';

// components
import Layout from 'layout/layout/layout-app';
import WidgetDetailHeader from './widget-detail-header';
import MapWidget from 'components/widgets/types/map';
import SwipeMapWidget from 'components/widgets/types/map-swipe';
import ChartWidget from 'components/widgets/types/chart';
import EmbedWidget from 'components/widgets/types/embed';
import RankingWidget from 'components/widgets/types/ranking';

// utils
import { getWidgetType } from 'utils/widget';

// types
import type { APIWidgetSpec } from 'types/widget';
import { useGeostore } from 'hooks/geostore';

export interface LayoutWidgetDetailProps {
  widget: APIWidgetSpec;
  params: Record<string, string | number>;
}

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), {
  ssr: false,
});

const LayoutWidgetDetail = ({ widget, params }: LayoutWidgetDetailProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  const openShareModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const widgetType = useMemo(() => (widget ? getWidgetType(widget) : null), [widget]);
  const aoi = useMemo(() => params?.aoi as string, [params]);
  const geostoreId = useMemo(() => params?.geostore_id as string, [params]);

  const { data: geostoreProperties } = useGeostore(
    aoi || geostoreId,
    {},
    {
      enabled: Boolean(aoi || geostoreId),
      select: (geostore) => {
        if (!geostore) return {};
        return geostore.geojson.features[0].properties || {};
      },
      placeholderData: null,
    },
  );

  const updatedQueryParams = useMemo(
    () => ({ ...params, ...(geostoreProperties as Record<string, string | number>) }),
    [params, geostoreProperties],
  );

  return (
    <Layout
      title={replace(widget?.name, updatedQueryParams)}
      description={widget?.description}
      thumbnail={widget?.thumbnailUrl}
      pageHeader
    >
      <div className="c-page-explore-detail">
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column">
                {widget && <WidgetDetailHeader widget={widget} params={updatedQueryParams} />}
              </div>
            </div>
          </div>
        </div>
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column">
                <div className="w-full h-full">
                  {widgetType === 'map' && (
                    <MapWidget
                      widgetId={widget.id}
                      {...(aoi && { areaOfInterest: aoi })}
                      params={updatedQueryParams}
                      onToggleShare={openShareModal}
                    />
                  )}

                  {['chart', 'widget'].includes(widgetType) && (
                    <ChartWidget
                      widgetId={widget.id}
                      encodeParams={false}
                      params={updatedQueryParams}
                      onToggleShare={openShareModal}
                    />
                  )}

                  {widgetType === 'map-swipe' && (
                    <SwipeMapWidget
                      widgetId={widget.id}
                      {...(aoi && { areaOfInterest: aoi })}
                      params={updatedQueryParams}
                      onToggleShare={openShareModal}
                    />
                  )}

                  {widgetType === 'embed' && (
                    <EmbedWidget widgetId={widget.id} onToggleShare={openShareModal} />
                  )}

                  {widgetType === 'ranking' && (
                    <RankingWidget
                      widgetId={widget.id}
                      params={updatedQueryParams}
                      onToggleShare={openShareModal}
                    />
                  )}

                  {showModal && (
                    <WidgetShareModal
                      isVisible
                      widget={widget}
                      onClose={closeShareModal}
                      params={updatedQueryParams}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LayoutWidgetDetail;
