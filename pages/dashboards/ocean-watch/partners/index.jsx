import {
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import PartnerBlock from 'components/partner-block';
import BannerCountries from 'components/banners/countries';

// hooks
import {
  usePublishedPartners,
} from 'hooks/partners';
import useCountryList from 'hooks/country/country-list';

const PARTNERS_PAGE_DESCRIPTION = `
We couldn’t do this on our own.
The World Resources Institute's Ocean Watch is a product that
brings together a range of timely and reliable data,
and partners from the public, private and non-governmental
organisations o support the integrated management of our ocean.
`;

export default function OceanWatchPartnersPage() {
  const router = useRouter();
  const {
    data: {
      collaboratingPartners,
      dataProviders,
      funders,
    },
  } = usePublishedPartners({}, {
    select: (_partners) => ({
      collaboratingPartners: _partners.filter((_partner) => _partner['partner-type'] === 'ow_collaborating-partner'),
      dataProviders: _partners.filter((_partner) => _partner['partner-type'] === 'ow_data-provider'),
      funders: _partners.filter((_partner) => _partner['partner-type'] === 'ow_funder'),
    }),
    placeholderData: {
      collaboratingPartners: [],
      dataProviders: [],
      funders: [],
    },
    refetchOnWindowFocus: false,
  });
  // todo: replace with Ocean Watch countries when available
  const {
    data: countries,
  } = useCountryList({
    select: (_countries) => _countries.map(({ name, geostoreId }) => ({
      label: name,
      value: geostoreId,
    })),
    refetchOnWindowFocus: false,
  });

  const handleCountry = useCallback((iso) => {
    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso,
      },
    });
  }, [router]);

  const partners = useMemo(() => [
    {
      title: 'Collaborating partners',
      children: collaboratingPartners,
    },
    {
      title: 'Data Providers',
      children: dataProviders,
    },
    {
      title: 'Funders',
      children: funders,
    },

  ], [collaboratingPartners, dataProviders, funders]);

  return (
    <LayoutOceanWatch
      title="Ocean Watch – Partners"
      description={PARTNERS_PAGE_DESCRIPTION}
    >
      <section className="l-section -secondary -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12 medium-8">
              <h2>
                Managing an integrated ocean requires collaboration
              </h2>
              <p>
                {PARTNERS_PAGE_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      </section>
      {(partners.map(({ title, children }) => (children.length > 0) && (
        <section
          key={title}
          className="l-section"
        >
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2 className="-text-center">
                  {title}
                </h2>
              </div>
            </div>
            <div className="row">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="column small-12 medium-6"
                >
                  <PartnerBlock
                    item={child}
                    isExternal
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )))}
      <section className="l-section -small">
        <div className="l-container">
          <BannerCountries
            title={(
              <>
                Explore the Ocean Watch
                <br />
                local data
              </>
              )}
            onChangeCountry={handleCountry}
            countryList={countries}
          />
        </div>
      </section>
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
