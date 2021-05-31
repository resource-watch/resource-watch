import classnames from 'classnames';
import {
  useQuery,
} from 'react-query';
import axios from 'axios';

// components
import LayoutOceanWatch from 'layout/layout/ocean-watch';
import MiniExplore from 'components/mini-explore';

// data
import OceanWatchConfigFile from 'public/static/data/ocean-watch';

const fetchConfigFile = () => {
  // As of date, we have 2 different databases for data,
  // so ids need to be different depending on the environment deployed.
  const isStagingAPI = process.env.NEXT_PUBLIC_WRI_API_URL.includes('staging-api.resourcewatch.org');
  // in development, we work with the local file
  if (process.env.NODE_ENV === 'development') return Promise.resolve(OceanWatchConfigFile[isStagingAPI ? 'staging' : 'production']);

  return axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ocean-watch.json')
    .then(({ data }) => data[isStagingAPI ? 'staging' : 'production']);
};

export default function OceanWatchCountryProfilePage() {
  const {
    data: oceanWatchConfig,
  } = useQuery(
    ['ocean-watch-config-file'],
    () => fetchConfigFile(),
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        content: [],
      },
      initialStale: true,
    },
  );

  return (
    <LayoutOceanWatch
      title="Ocean Watch"
      description="Ocean Watch description" // todo: replace description
    >
      <div className="l-container">
        {oceanWatchConfig.content.map((rowContent) => (
          <section className="l-section -small">
            <div className="cw-wysiwyg-list-item -isReadOnly">
              <div className="row">
                {rowContent.map((blockContent) => (
                  <div className={classnames({
                    column: true,
                    'small-12': blockContent.grid === '100%',
                    'medium-6': blockContent.grid === '50%',
                  })}
                  >
                    {blockContent.title && (
                      <h2>
                        {blockContent.title}
                      </h2>
                    )}
                    {blockContent.text && (
                      <p>
                        {blockContent.text}
                      </p>
                    )}
                    {blockContent.visualizationType === 'mini-explore' && (
                      <MiniExplore
                        config={blockContent.config}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
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
    props: ({}),
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
