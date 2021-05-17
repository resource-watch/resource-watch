// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MiniExplore from 'components/mini-explore';

// todo: replace with datasets from staging API before deploying!
const MINI_EXPLORE_CONFIG = {
  // title of the Mini Explore
  title: 'Lorem ipsum',
  // geostore of the area to display (if any)
  areaOfInterest: '972c24e1da2c2baacc7572ee9501abdc',
  // datasets split into different groups
  datasetGroups: [
    {
      // title of the group
      title: 'Power Infrastructure',
      // datasets that form the group
      datasets: [
        '92cb0e3c-369e-4c66-908c-5723f608e35b',
        'b75d8398-34f2-447d-832d-ea570451995a',
        '4919be3a-c543-4964-a224-83ef801370de',
      ],
      // default datasets to display when Mini Explore is initialized
      default: [
        '92cb0e3c-369e-4c66-908c-5723f608e35b',
      ],
    },
    {
      title: 'Natural hazards',
      datasets: [
        '484f10d3-a30b-4466-8052-c48d47cfb4a1',
        'c5a62289-bdc8-4821-83f0-6f05e3d36bdc',
      ],
      default: [
        '484f10d3-a30b-4466-8052-c48d47cfb4a1',
      ],
    },
  ],
};

export default function OceanWatchCountryProfilePage() {
  return (
    <LayoutOceanWatch
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      <section className="l-section -medium">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <MiniExplore
                config={MINI_EXPLORE_CONFIG}
              />
            </div>
          </div>
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
