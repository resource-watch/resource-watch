import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

// Components
import Layout from 'layout/layout/layout-app';

// Modal
import Modal from 'components/modal/modal-component';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreMenu from 'layout/explore/explore-menu';
// import ExploreDatasetsHeader from 'layout/explore/explore-datasets-header';
import ExploreDatasets from 'layout/explore/explore-datasets';
import ExploreMap from 'layout/explore/explore-map';
import ExploreDetail from 'layout/explore/explore-detail';
import ExploreTopics from 'layout/explore/explore-topics';
import ExploreCollections from 'layout/explore/explore-collections';
import ExploreLogin from 'layout/explore/explore-login';
import ExploreDiscover from 'layout/explore/explore-discover';
import ExploreNearRealTime from 'layout/explore/explore-near-real-time';
import ExploreFavorites from 'layout/explore/explore-favorites';

// utils
import { breakpoints } from 'utils/responsive';
import { EXPLORE_SECTIONS } from './constants';

function Explore(props) {
  const {
    responsive,
    explore: { datasets: { selected }, sidebar: { section } },
    userIsLoggedIn
  } = props;
  const [mobileWarningOpened, setMobileWarningOpened] = useState(true);
  const [exploreSectionAlreadyLoaded, setExploreSectionAlreadyLoaded] = useState(!selected);
  const exploreSectionShouldBeLoaded = !selected || exploreSectionAlreadyLoaded;

  useEffect(() => {
    if (!exploreSectionAlreadyLoaded) {
      setExploreSectionAlreadyLoaded(true);
    }
  }, [selected]);

  const getSidebarLayout = () => (
    <Fragment>
      <ExploreMenu />
      <div
        className="explore-sidebar-content"
        id="sidebar-content-container"
        key={section}
      >
        {section === EXPLORE_SECTIONS.ALL_DATA &&
          exploreSectionShouldBeLoaded &&
          <ExploreDatasets />
        }
        {section === EXPLORE_SECTIONS.TOPICS &&
          exploreSectionShouldBeLoaded &&
          <ExploreTopics />
        }
        {section === EXPLORE_SECTIONS.COLLECTIONS && userIsLoggedIn
          && exploreSectionShouldBeLoaded &&
          <ExploreCollections />
        }
        {section === EXPLORE_SECTIONS.FAVORITES && userIsLoggedIn
          && exploreSectionShouldBeLoaded &&
          <ExploreFavorites />
        }
        {(section === EXPLORE_SECTIONS.COLLECTIONS ||
          section === EXPLORE_SECTIONS.FAVORITES) && !userIsLoggedIn
          && exploreSectionShouldBeLoaded &&
          <ExploreLogin />
        }
        {section === EXPLORE_SECTIONS.DISCOVER &&
          exploreSectionShouldBeLoaded &&
          <ExploreDiscover />
        }
        {section === EXPLORE_SECTIONS.NEAR_REAL_TIME
          && exploreSectionShouldBeLoaded &&
          <ExploreNearRealTime />
        }
      </div>
      {selected && <ExploreDetail key={selected} />}
    </Fragment>
  );

  return (
    <Layout
      title="Explore Data Sets — Resource Watch"
      description="Browse more than 200 global data sets on the state of our planet."
      className="-fullscreen"
    >
      <div className="c-page-explore">
        {/*
           We set this key so that, by rerendering the sidebar, the sections are
           scrolled to the top when the selected section changes.
        */}
        <MediaQuery
          minWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <Fragment>
            <ExploreSidebar
              key={section}
            >
              {getSidebarLayout()}
            </ExploreSidebar>
            <ExploreMap />
          </Fragment>
        </MediaQuery>
        <MediaQuery
          maxWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          {getSidebarLayout()}
        </MediaQuery>
        
        {/* Mobile warning */}
        <MediaQuery
          maxDeviceWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <Modal
            isOpen={mobileWarningOpened}
            onRequestClose={() => setMobileWarningOpened(false)}
          >
            <div>
              <p>The mobile version of Explore has limited functionality,
              please check the desktop version to have access to the
              full list of features available.
              </p>
            </div>
          </Modal>
        </MediaQuery>
      </div>
    </Layout>
  );
}

Explore.propTypes = {
  responsive: PropTypes.object.isRequired,
  explore: PropTypes.object.isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired
};

export default Explore;
