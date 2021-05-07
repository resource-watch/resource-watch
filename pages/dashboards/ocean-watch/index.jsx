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
        <div className="row">
          <div className="column small-12">
            Introduction
          </div>
        </div>
      </div>
    </LayoutOceanWatch>
  );
}

export async function getStaticProps() {
  // feature flag to avoid display any Ocean Watch development in other environments
  if (!process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}
