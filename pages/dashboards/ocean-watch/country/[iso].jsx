import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
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

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import InView from 'components/in-view';
import MiniExplore from 'components/mini-explore';
import MiniExploreWidgets from 'components/mini-explore-widgets';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';
import MapWidget from 'components/widgets/types/map';
import SwipeMapWidget from 'components/widgets/types/map-swipe';
import ChartWidget from 'components/widgets/types/chart';

// hooks
import {
  useOceanWatchAreas,
} from 'hooks/ocean-watch';

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

export default function OceanWatchCountryProfilePage({
  iso,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [widgetToShare, setWidgetToShare] = useState(null);
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const handleAreaChange = useCallback(({ value }) => {
    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso: value,
      },
    });
  }, [router]);

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  const {
    data: areas,
  } = useOceanWatchAreas({
    placeholderData: queryClient.getQueryData('ocean-watch-areas') || [],
  });

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
    .find((rowContent) => !!rowContent.find((blockContent) => blockContent.visualizationType === 'main-indicators-set'))?.[0], [serializedConfiguration]);

  const area = useMemo(() => areas.find(({ iso: areaId }) => iso === areaId), [areas, iso]);

  const areaOptions = useMemo(() => areas.map(({
    name: label,
    iso: value,
  }) => ({
    label,
    value,
  })), [areas]);

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
                    <InView
                      triggerOnce
                      threshold={0.25}
                    >
                      {({ ref, inView }) => (
                        <div ref={ref}>
                          {blockContent.visualizationType === 'mini-explore' && inView && (
                            <MiniExplore
                              config={{
                                ...blockContent.config,
                                ...area?.geostore && { areaOfInterest: area.geostore },
                              }}
                            />
                          )}
                        </div>
                      )}
                    </InView>
                    <InView
                      triggerOnce
                      threshold={0.25}
                    >
                      {({ ref, inView }) => (
                        <div ref={ref}>
                          {blockContent.visualizationType === 'mini-explore-widgets' && inView && (
                            <MiniExploreWidgets
                              adapter={RWAdapter}
                              config={{
                                ...blockContent.config,
                                ...area?.geostore && { areaOfInterest: area.geostore },
                              }}
                            />
                          )}
                        </div>
                      )}
                    </InView>
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
                    <InView
                      triggerOnce
                      threshold={0.25}
                    >
                      {({ ref, inView }) => (
                        <div ref={ref}>
                          {blockContent.visualizationType === 'indicators-set' && inView && (
                            <CardIndicatorSet
                              config={blockContent.config}
                              params={{
                                iso,
                              }}
                              theme={blockContent?.config?.theme}
                            >
                              {(blockContent?.config?.indicators || [])
                                .map(({ id, title, icon }) => (
                                  <CardIndicator
                                    key={id}
                                    id={id}
                                    title={title}
                                    icon={icon}
                                    theme={blockContent?.config?.theme}
                                  />
                                ))}
                            </CardIndicatorSet>
                          )}
                        </div>
                      )}
                    </InView>
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

OceanWatchCountryProfilePage.propTypes = {
  iso: PropTypes.string.isRequired,
};

export async function getStaticProps({
  params,
}) {
  const {
    iso,
  } = params;
  const queryClient = new QueryClient();

  // feature flag to avoid display any Ocean Watch development in other environments
  if (process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH !== 'true') {
    return ({
      notFound: true,
    });
  }

  return {
    props: ({
      iso,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    }),
    revalidate: 300,
  };
}

export async function getStaticPaths() {
  const queryClient = new QueryClient();

  // prefetch areas
  await queryClient.prefetchQuery('ocean-watch-areas', fetchOceanWatchAreas);
  const areas = queryClient.getQueryData('ocean-watch-areas');

  return {
    paths: areas.map(({ iso }) => ({
      params: {
        iso,
      },
    })),
    fallback: false,
  };
}
