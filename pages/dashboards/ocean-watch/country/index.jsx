// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';

export default function OceanWatchCountryProfiles() {
  return (
    <LayoutOceanWatch
      title="Ocean Watch – Country Profiles Index"
      description="Ocean Watch description" // todo: replace description
    >
      <section className="l-section -secondary -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12 medium-8">
              {/* //todo: update title and description */}
              <h2>
                Ocean Watch Country Profiles
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Itaque doloribus corrupti nemo distinctio? Sunt sapiente
                voluptate tempore temporibus delectus, blanditiis,
                illum consequatur nihil consectetur quo ratione ea expedita, eum reprehenderit.
              </p>
            </div>
          </div>
        </div>
      </section>
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
