import { useRouter } from 'next/router';

// components
import Layout from 'layout/layout/layout-app';

export default function OceanWatchCountryProfilePage() {
  const {
    query: {
      iso,
    },
  } = useRouter();
  return (
    <Layout
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      {`Country ${iso}`}
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
