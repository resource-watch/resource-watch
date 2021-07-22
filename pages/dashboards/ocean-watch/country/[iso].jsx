import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import classnames from 'classnames';
import {
  useQuery,
  QueryClient,
  useQueryClient,
} from 'react-query';
import { dehydrate } from 'react-query/hydration';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  useSelector,
} from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import sortBy from 'lodash/sortBy';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MiniExplore from 'components/mini-explore';
import MiniExploreWidgets from 'components/mini-explore-widgets';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';
import MapWidget from 'components/widgets/types/map';
import SwipeMapWidget from 'components/widgets/types/map-swipe';
import ChartWidget from 'components/widgets/types/chart';

// services
import {
  fetchConfigFile,
  fetchOceanWatchAreas,
} from 'services/ocean-watch';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';
import {
  isStagingAPI,
} from 'utils/api';

const isStaging = isStagingAPI();

const WidgetShareModal = dynamic(() => import('../../../../components/widgets/share-modal'), { ssr: false });

export default function OceanWatchCountryProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    query: {
      iso,
    },
  } = router;
  const [widgetToShare, setWidgetToShare] = useState(null);
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  const areas = queryClient.getQueryData('ocean-watch-areas');

  const {
    data: oceanWatchConfig,
  } = useQuery(
    ['ocean-watch-config-file'],
    () => fetchConfigFile(),
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        intro: [],
        'country-profile': [],
      },
      initialStale: true,
    },
  );

  const handleAreaChange = useCallback(({ value }) => {
    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso: value,
      },
    },
    {},
    {
      shallow: true,
    });
  }, [router]);

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  const serializedConfiguration = useMemo(() => (oceanWatchConfig['country-profile'])
    .map((rowContent) => {
      const rowId = uuidv4();

      return ([
        ...rowContent.map((blockContent) => ({
          ...blockContent,
          id: uuidv4(),
          rowId,
        })),
      ]);
    }), [oceanWatchConfig]);

  const indicatorSetConfiguration = useMemo(() => serializedConfiguration
    .find((rowContent) => !!rowContent.find((blockContent) => blockContent.visualizationType === 'indicators-set'))?.[0], [serializedConfiguration]);

  const area = useMemo(() => areas.find(({ iso: areaId }) => iso === areaId), [areas, iso]);

  const areaOptions = useMemo(() => sortBy(areas.map(({
    name: label,
    iso: value,
  }) => ({
    label,
    value,
  })), ['label']), [areas]);

  const defaultAreaOption = useMemo(
    () => areaOptions.find(({ value }) => iso === value),
    [areaOptions, iso],
  );

  return (
    <LayoutOceanWatch
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      <section className="l-section -small  -secondary">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div style={{
                paddingBottom: 30,
              }}
              >
                <Select
                  instanceId="area-selector"
                  options={areaOptions}
                  className="-fluid"
                  onChange={handleAreaChange}
                  value={defaultAreaOption}
                  clearable={false}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12">
              {indicatorSetConfiguration && (
                <CardIndicatorSet
                  config={indicatorSetConfiguration.config}
                  params={{
                    iso,
                  }}
                  theme={indicatorSetConfiguration?.config?.theme}
                >
                  {(indicatorSetConfiguration?.config?.indicators || [])
                    .map(({ id, title, icon }) => (
                      <CardIndicator
                        key={id}
                        id={id}
                        title={title}
                        icon={icon}
                        theme={indicatorSetConfiguration?.config?.theme}
                      />
                    ))}
                </CardIndicatorSet>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="l-container">
        {serializedConfiguration.map((rowContent) => (
          <section
            key={rowContent[0]?.rowId}
            className="l-section -small"
          >
            <div className="cw-wysiwyg-list-item -isReadOnly">
              <div className="row">
                {rowContent.map((blockContent) => (
                  <div
                    key={blockContent.id}
                    className={classnames({
                      column: true,
                      'small-12': blockContent.grid === '100%',
                      'medium-6': blockContent.grid === '50%',
                    })}
                  >
                    {blockContent.title && (
                      <h2>
                        {blockContent.title}
                      </h2>
                    )}
                    {blockContent.text && (
                      <p>
                        {blockContent.text}
                      </p>
                    )}
                    {blockContent.visualizationType === 'mini-explore' && (
                      <MiniExplore
                        config={{
                          ...blockContent.config,
                          ...area?.geostore && { areaOfInterest: area.geostore },
                        }}
                      />
                    )}
                    {blockContent.visualizationType === 'mini-explore-widgets' && (
                      <MiniExploreWidgets
                        adapter={RWAdapter}
                        config={{
                          ...blockContent.config,
                          ...area?.geostore && { areaOfInterest: area.geostore },
                        }}
                        widgetParams={{
                          geostore_env: isStaging ? 'geostore_staging' : 'geostore_prod',
                          ...area?.geostore && { geostore_id: area.geostore },
                        }}
                      />
                    )}
                    {(blockContent.widget && blockContent.type === 'map') && (
                      <MapWidget
                        widgetId={blockContent.widget}
                        params={{
                          geostore_env: isStaging ? 'geostore_staging' : 'geostore_prod',
                          ...area?.geostore && { geostore_id: area.geostore },
                        }}
                        {...area?.geostore && { areaOfInterest: area.geostore }}
                        onToggleShare={handleShareWidget}
                      />
                    )}
                    {(blockContent.widget && blockContent.type === 'map-swipe') && (
                      <SwipeMapWidget
                        widgetId={blockContent.widget}
                        params={{
                          geostore_env: isStaging ? 'geostore_staging' : 'geostore_prod',
                          ...area?.geostore && { geostore_id: area.geostore },
                        }}
                        {...area?.geostore && { areaOfInterest: area.geostore }}
                        onToggleShare={handleShareWidget}
                      />
                    )}
                    {(blockContent.widget && blockContent.type === 'chart') && (
                      <ChartWidget
                        adapter={RWAdapter}
                        widgetId={blockContent.widget}
                        {...area?.geostore && { areaOfInterest: area.geostore }}
                        onToggleShare={handleShareWidget}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      {(!!widgetToShare) && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
        />
      )}
    </LayoutOceanWatch>
  );
}

export async function getServerSideProps({
  query,
}) {
  const {
    iso,
  } = query;
  const queryClient = new QueryClient();

  // prefetch areas
  await queryClient.prefetchQuery('ocean-watch-areas', fetchOceanWatchAreas);
  const areas = queryClient.getQueryData('ocean-watch-areas');
  const areaFound = areas.find((area) => iso === area.iso);

  // feature flag to avoid display any Ocean Watch development in other environments
  // if an area is not found, redirect to Not Found page
  if (process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH !== 'true' || !areaFound) {
    return ({
      notFound: true,
    });
  }

  return {
    props: ({
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    }),
  };
}
