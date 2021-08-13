import dynamic from 'next/dynamic';
import {
  useQuery,
} from 'react-query';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MapSelection from 'layout/layout/ocean-watch/map/component';

// services
import {
  fetchConfigFile,
} from 'services/ocean-watch';

const OceanWatchStoryTelling = dynamic(() => import('../../../layout/layout/ocean-watch/storytelling'), { ssr: false });

export default function OceanWatchIntroPage() {
  const {
    data: oceanWatchConfig,
  } = useQuery(
    ['ocean-watch-config-file'],
    () => fetchConfigFile(),
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        intro: [],
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
      </div>
      <div style={{
        // background: '#0F4573',
        background: 'linear-gradient(transparent, #0F4573)',
      }}
      >
        <OceanWatchStoryTelling
          indicators={oceanWatchConfig.intro.indicators}
        />
      </div>
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <MapSelection />
          </div>
        </div>
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
