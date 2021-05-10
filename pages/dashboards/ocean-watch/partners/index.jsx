// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';

export default function OceanWatchPartnersPage() {
  return (
    <LayoutOceanWatch
      title="Ocean Watch – Partners"
      description="Ocean Watch description" // todo: replace description
    >
      Partners
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
