import {
  useState,
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
import OceanWatchPartners from 'layout/layout/ocean-watch/partners';

export default function OceanWatchCountryProfiles() {
  const router = useRouter();
  const [countryValue, setCountryValue] = useState();

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
    setCountryValue(value);
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
      <section className="l-section -secondary -small">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <Select
                instanceId="area-selector"
                options={areas}
                className="-large"
                onChange={handleAreaChange}
                clearable={false}
                value={countryValue}
                placeholder="Select a country"
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 550,
                  width: '100%',
                  margin: '25px 0 0',
                  background: 'url(/static/images/ocean-watch/placeholder-map.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <h3
                  style={{
                    color: '#393f44',
                    fontSize: 26,
                    fontWeight: 300,
                    textAlign: 'center',
                  }}
                >
                  Select a coastal country to further explore
                  {' '}
                  <br />
                  land-based pressures upon the ocean.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="l-section -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <OceanWatchPartners />
            </div>
          </div>
        </div>
      </section>
    </LayoutOceanWatch>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
