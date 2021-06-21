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

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MiniExplore from 'components/mini-explore';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';
import MapWidget from 'components/widgets/types/map';
import ChartWidget from 'components/widgets/types/chart';

// services
import { fetchConfigFile } from 'services/ocean-watch';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

const WidgetShareModal = dynamic(() => import('../../../../components/widgets/share-modal'), { ssr: false });

export default function OceanWatchCountryProfilePage() {
  const [widgetToShare, setWidgetToShare] = useState(null);
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  // todo: move this fetching to getStaticProps function when getInitialProps is gone
  const {
    query: {
      iso,
    },
  } = useRouter();
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

  return (
    <LayoutOceanWatch
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      <section className="l-section -small  -secondary">
        <div className="l-container">
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
                        config={blockContent.config}
                      />
                    )}
                    {(blockContent.widget && blockContent.type === 'map') && (
                      <MapWidget
                        widgetId={blockContent.widget}
                        // todo: replace with geostore
                        areaOfInterest="972c24e1da2c2baacc7572ee9501abdc"
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
  // feature flag to avoid display any Ocean Watch development in other environments
  if (process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH !== 'true') {
    return {
      notFound: true,
    };
  }

  return {
    props: ({}),
  };
}

export async function getStaticPaths() {
  // todo: replace fetching list
  const countryList = [
    'ESP',
    'BRA',
  ];

  const paths = countryList.map((iso) => ({
    params: {
      iso,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
