import {
  useMemo,
} from 'react';
import classnames from 'classnames';
import {
  useQuery,
} from 'react-query';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MiniExplore from 'components/mini-explore';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';

// services
import { fetchConfigFile } from 'services/ocean-watch';

export default function OceanWatchCountryProfilePage() {
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

  const indicatorSetConfiguration = useMemo(() => oceanWatchConfig['country-profile']
    .find((rowContent) => !!rowContent.find((blockContent) => blockContent.visualizationType === 'indicators-set'))?.[0], [oceanWatchConfig]);

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
        {oceanWatchConfig['country-profile'].map((rowContent) => (
          <section
            key={uuidv4()}
            className="l-section -small"
          >
            <div className="cw-wysiwyg-list-item -isReadOnly">
              <div className="row">
                {rowContent.map((blockContent) => (
                  <div
                    key={uuidv4()}
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
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
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
