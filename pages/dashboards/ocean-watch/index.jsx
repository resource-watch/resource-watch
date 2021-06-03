// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';

export default function OceanWatchIntroPage() {
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
