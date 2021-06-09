import classnames from 'classnames';
import {
  useQuery,
} from 'react-query';
import { v4 as uuidv4 } from 'uuid';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import CardIndicatorSet from 'components/card-indicator-set';
import CardIndicator from 'components/card-indicator-set/card-indicator';

// services
import { fetchConfigFile } from 'services/ocean-watch';

export default function OceanWatchIntroPage() {
  // todo: move this fetching to getStaticProps function when getInitialProps is gone
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

  return (
    <LayoutOceanWatch
      title="Ocean Watch – Introduction"
      description="Ocean Watch description" // todo: replace description
      isExtendedHero
    >
      <div className="l-container">
        <section className="l-section -small">
          <div className="row">
            <div className="column small-12 medium-8">
              <p style={{
                color: '#fff',
              }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Ratione obcaecati facilis consequuntur sapiente consectetur
                ea voluptates ipsa veniam necessitatibus dolores quasi ad maxime,
                cum totam ex ut illo eius voluptatibus!
              </p>
            </div>
          </div>
        </section>
        {oceanWatchConfig.intro.map((rowContent) => (
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
                    {blockContent.visualizationType === 'indicators-set' && (
                      <CardIndicatorSet
                        config={blockContent.config}
                      >
                        {(blockContent?.config?.indicators || []).map(({ id, title, icon }) => (
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
    props: {},
  };
}
