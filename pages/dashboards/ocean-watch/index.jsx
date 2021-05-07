// components
import Layout from 'layout/layout/layout-app';

export default function OceanWatchIntroPage() {
  return (
    <Layout
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      Introduction
    </Layout>
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
