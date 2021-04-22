import {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import Layout from 'layout/layout/layout-app';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list';
import Banner from 'components/app/common/Banner';
import LoginRequired from 'components/ui/login-required';

// hooks
import {
  useFeaturedDashboards,
  useHighlightedDashboards,
} from 'hooks/dashboard';

export default function LayoutDashboards({
  dataPage,
}) {
  const router = useRouter();
  const styles = useMemo(() => {
    if (dataPage?.photo?.cover) return ({ backgroundImage: `url(${dataPage.photo.cover})` });
    return ({});
  }, [dataPage]);

  const onSelectDashboard = useCallback(({ slug }) => {
    router.push(`/dashboards/${slug}`);
  }, [router]);

  const {
    data: featuredDashboards,
  } = useFeaturedDashboards({}, {
    select: (_dashboards) => _dashboards.map(({
      name,
      slug,
      photo,
      user,
    }) => ({
      name,
      slug,
      photo,
      user,
    })),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  const {
    data: highlightedDashboards,
  } = useHighlightedDashboards({
    include: 'user',
  }, {
    select: (_dashboards) => _dashboards.map(({
      name,
      slug,
      photo,
      user,
    }) => ({
      name,
      slug,
      photo,
      user,
    })),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <Layout
      title="Dashboards"
      description="The latest facts and figures on cities, energy, food and more."
      className="l-static"
    >
      <div className="l-content">
        <div className="l-content-header">
          <div className="cover" style={styles}>
            <div className="row">
              <div className="column small-12">
                <div className="content">
                  <h1>Dashboards</h1>
                  <p>{dataPage?.summary || 'Find data and visualizations for different topic areas of interest'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="featuredDashboards" className="l-section -small">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="c-dashboards-subheader-block">
                <h2>Featured dashboards</h2>
                <p>
                  Discover collections of curated data on the major
                  challenges facing human society and the planet
                </p>
              </div>
              <DashboardThumbnailList
                onSelect={onSelectDashboard}
                dashboards={featuredDashboards}
              />
            </div>
          </div>
        </div>
      </div>
      {(highlightedDashboards.length > 0) && (
        <div id="dashboardsGallery" className="l-section -small">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="c-dashboards-subheader-block">
                  <h2>Dashboard gallery</h2>
                  <p>
                    Browse collections of data and visualizations
                    developed by the Resource Watch team and partners
                  </p>
                </div>
                <DashboardThumbnailList
                  onSelect={onSelectDashboard}
                  dashboards={highlightedDashboards}
                  user
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center">
                <p className="-claim">
                  Create and share
                  {' '}
                  <br />
                  custom visualizations.
                </p>
                <LoginRequired>
                  <Link
                    href="/myrw/dashboards"
                  >
                    <a
                      className="c-button -alt -primary"
                    >
                      Create a dashboard
                    </a>
                  </Link>
                </LoginRequired>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </Layout>
  );
}

LayoutDashboards.propTypes = {
  dataPage: PropTypes.shape({
    summary: PropTypes.string,
    photo: PropTypes.shape({
      cover: PropTypes.string,
    }),
  }).isRequired,
};
