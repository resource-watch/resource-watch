import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  useQuery,
} from 'react-query';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchHero from 'layout/layout/ocean-watch/hero';
import MapSelection from 'layout/layout/ocean-watch/map/component';
import Banner from 'components/app/common/Banner';

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
      <div
        className="hero-extended-background"
        style={{
          position: 'relative',
          padding: '0 0 150px',
        }}
      >
        <Header className="-transparent" />
        <OceanWatchHero className="-transparent" />

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
          position: 'absolute',
          bottom: '0',
          display: 'inline-block',
          width: '100%',
          height: 200,
          background: 'linear-gradient(to bottom, transparent, #0F4573)',
        }}
        />
      </div>

      <div style={{
        background: '#0F4573',
        margin: '-85px 0 0',
      }}
      >
        <OceanWatchStoryTelling
          indicators={oceanWatchConfig.intro.indicators}
          steps={oceanWatchConfig.intro.steps}
        />

        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div
                id="countries-selection"
                style={{
                  padding: '25px 0 175px',
                }}
              >
                <MapSelection />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          transform: 'translate(0, calc(-265px / 2))',
        }}
      >
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <Banner
                useDim
                className="-text-center"
                bgImage="/static/images/pages/app/banner-coral.jpg"
              >
                <p className="-claim">
                  Check the Coral Reefs dashboard
                </p>
                <a
                  className="c-button -alt -primary"
                  href="https://resourcewatch.org/dashboards/coral-reefs"
                >
                  Coral Reefs
                </a>
              </Banner>
            </div>
            <div
              className="column small-6"
              style={{
                margin: '20px 0 0',
              }}
            >
              <Banner
                bgImage="/static/images/homepage/home-data-bg1.png"
                styles={{
                  padding: 40,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <p className="-claim">
                      Did you miss something?
                    </p>
                    <p>
                      Know of a data set that you&apos;d like to see on Resource Watch or have
                      a specific area of interest you&apos;d like us to cover?
                    </p>
                  </div>
                  <Link href="/get-involved/contribute-data">
                    <a className="c-button -alt -primary">
                      Request data
                    </a>
                  </Link>
                </div>
              </Banner>
            </div>
            <div
              className="column small-6"
              style={{
                margin: '20px 0 0',
              }}
            >
              <Banner
                bgImage="/static/images/backgrounds/jellyfish.jpg"
                styles={{
                  padding: 40,
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p className="-claim">
                      Suggest a story
                    </p>
                    <p>
                      Have you uncovered an interesting connection in the data
                      we should tell a story about?
                    </p>
                  </div>
                  <Link href="/get-involved/suggest-a-story">
                    <a className="c-button -alt -primary">
                      Suggest a story
                    </a>
                  </Link>
                </div>
              </Banner>
            </div>
            <div
              className="column small-12"
              style={{
                margin: '20px 0 0',
              }}
            >
              <Banner
                useDim
                className="-text-center"
                bgImage="/static/images/pages/app/banner-ocean-watch.jpg"
              >
                <p className="-claim">
                  Check out the Ocean Watch data
                  <br />
                  on the Explore page
                </p>
                <Link href="/data/explore?section=All data&topics=[&quot;ocean&quot;]">
                  <a className="c-button -alt -primary">
                    Go to explore
                  </a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
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
            <div
              style={{
                padding: '25px 0 175px',
              }}
            >
              <MapSelection />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: '#fff',
        }}
      >
        <div
          style={{
            transform: 'translate(0, calc(-265px / 2))',
          }}
        >
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Banner
                  useDim
                  className="-text-center"
                  bgImage="/static/images/pages/app/banner-coral.jpg"
                >
                  <p className="-claim">
                    Check the Coral Reefs dashboard
                  </p>
                  <a
                    className="c-button -alt -primary"
                    href="https://resourcewatch.org/dashboards/coral-reefs"
                  >
                    Coral Reefs
                  </a>
                </Banner>
              </div>
              <div
                className="column small-6"
                style={{
                  margin: '20px 0 0',
                }}
              >
                <Banner
                  bgImage="/static/images/homepage/home-data-bg1.png"
                  styles={{
                    padding: 40,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p className="-claim">
                        Did you miss something?
                      </p>
                      <p>
                        Know of a data set that you&apos;d like to see on Resource Watch or have
                        a specific area of interest you&apos;d like us to cover?
                      </p>
                    </div>
                    <Link href="/get-involved/contribute-data">
                      <a className="c-button -alt -primary">
                        Request data
                      </a>
                    </Link>
                  </div>
                </Banner>
              </div>
              <div
                className="column small-6"
                style={{
                  margin: '20px 0 0',
                }}
              >
                <Banner
                  bgImage="/static/images/backgrounds/jellyfish.jpg"
                  styles={{
                    padding: 40,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      height: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p className="-claim">
                        Suggest a story
                      </p>
                      <p>
                        Have you uncovered an interesting connection in the data
                        we should tell a story about?
                      </p>
                    </div>
                    <Link href="/get-involved/suggest-a-story">
                      <a className="c-button -alt -primary">
                        Suggest a story
                      </a>
                    </Link>
                  </div>
                </Banner>
              </div>
              <div
                className="column small-12"
                style={{
                  margin: '20px 0 0',
                }}
              >
                <Banner
                  useDim
                  className="-text-center"
                  bgImage="/static/images/pages/app/banner-ocean-watch.jpg"
                >
                  <p className="-claim">
                    Check out the Ocean Watch data
                    <br />
                    on the Explore page
                  </p>
                  <Link href="/data/explore?section=All data&topics=[&quot;ocean&quot;]">
                    <a className="c-button -alt -primary">
                      Go to explore
                    </a>
                  </Link>
                </Banner>
              </div>
            </div>
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
