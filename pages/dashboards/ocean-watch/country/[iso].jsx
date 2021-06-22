import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import classnames from 'classnames';
import {
  useQuery,
} from 'react-query';
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
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';
import MapWidget from 'components/widgets/types/map';
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

const WidgetShareModal = dynamic(() => import('../../../../components/widgets/share-modal'), { ssr: false });

export default function OceanWatchCountryProfilePage() {
  const router = useRouter();
  // todo: move this fetching to getStaticProps function when getInitialProps is gone
  const {
    query: {
      iso,
    },
  } = router;
  const [widgetToShare, setWidgetToShare] = useState(null);
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  // todo: enable when getInitialProps is gone and hydration is implemented
  // const areas = queryClient.getQueryData('ocean-watch-areas');

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

  const {
    data: areas,
  } = useQuery(
    ['ocean-watch-areas'],
    () => fetchOceanWatchAreas(),
    {
      refetchOnWindowFocus: false,
      placeholderData: [],
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
                    {(blockContent.widget && blockContent.type === 'map') && (
                      <MapWidget
                        widgetId={blockContent.widget}
                        {...area?.geostore && { areaOfInterest: area.geostore }}
                        onToggleShare={handleShareWidget}
                      />
                    )}
                    {(blockContent.widget && blockContent.type === 'chart') && (
                      <ChartWidget
                        adapter={RWAdapter}
                        widgetId={blockContent.widget}
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

export async function getStaticProps() {
  // const {
  //   iso,
  // } = params;
  // feature flag to avoid display any Ocean Watch development in other environments
  if (process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH !== 'true') {
    return {
      notFound: true,
    };
  }

  return {
    props: ({
      // todo: enable when getInitialProps is gone
      // iso,
      // todo: enable when getInitialProps is gone and hydration is implemented
      // dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    }),
  };
}

export async function getStaticPaths() {
  // todo: enable when getInitialProps is gone and hydration is implemented
  // await queryClient.prefetchQuery('ocean-watch-areas', fetchOceanWatchAreas);
  const areas = await fetchOceanWatchAreas();

  const paths = areas.map(({ iso }) => ({
    params: {
      iso,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
