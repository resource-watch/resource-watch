import {
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import sortBy from 'lodash/sortBy';
import Select from 'react-select';

// hooks
import {
  useOceanWatchAreas,
} from 'hooks/ocean-watch';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchHero from 'layout/layout/ocean-watch/hero';

export default function OceanWatchCountryProfiles() {
  const router = useRouter();

  const {
    data: areas,
  } = useOceanWatchAreas({
    select: (_areas) => sortBy(_areas.map(({
      name: label,
      iso: value,
    }) => ({
      label,
      value,
    })), ['label']),
  });

  const handleAreaChange = useCallback(({ value }) => {
    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso: value,
      },
    });
  }, [router]);

  return (
    <LayoutOceanWatch
      title="Ocean Watch – Country Profiles Index"
      description="Ocean Watch description" // todo: replace description
    >
      <Header className="-transparent" />
      <OceanWatchHero className="-ocean-watch" />
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
          <div className="row">
            <div className="column small-12">
              <div style={{
                paddingTop: 30,
              }}
              >
                <Select
                  instanceId="area-selector"
                  options={areas}
                  className="-fluid"
                  onChange={handleAreaChange}
                  clearable={false}
                />
              </div>
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
