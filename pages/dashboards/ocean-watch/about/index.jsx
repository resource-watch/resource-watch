import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  useQueryClient,
} from 'react-query';
import renderHTML from 'react-render-html';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import Header from 'layout/header';
import OceanWatchHero from 'layout/layout/ocean-watch/hero';
import BannerCountries from 'components/banners/countries';
import OceanWatchPartners from 'layout/layout/ocean-watch/partners';

// services
import { fetchPage } from 'services/pages';

// hooks
import {
  useOceanWatchAreas,
} from 'hooks/ocean-watch';

export default function OceanWatchAboutPage({
  content,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: countries,
  } = useOceanWatchAreas({
    placeholderData: queryClient.getQueryData('ocean-watch-areas') || [],
    select: (_countries) => _countries.map(({ name, iso }) => ({
      label: name,
      value: iso,
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

  return (
    <LayoutOceanWatch
      title="About | Ocean Watch"
      description={content.summary}
    >
      <Header className="-transparent" />
      <OceanWatchHero className="-ocean-watch" />
      <section className="l-section -secondary -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12 medium-8">
              <h2>
                {content.summary}
              </h2>
              <p>
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="l-section -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              {renderHTML(content.content)}
            </div>
          </div>
        </div>
      </section>
      <section className="l-section -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
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

OceanWatchAboutPage.propTypes = {
  content: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export async function getStaticProps() {
  const content = await fetchPage('about-ocean-watch');

  return {
    props: {
      content,
    },
  };
}
