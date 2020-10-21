import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

// Components
import Layout from 'layout/layout/layout-app';

// Modal
import Modal from 'components/modal/modal-component';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreMenu from 'layout/explore/explore-menu';
import ExploreDatasets from 'layout/explore/explore-datasets';
import ExploreMap from 'layout/explore/explore-map';
import ExploreDetail from 'layout/explore/explore-detail';
import ExploreTopics from 'layout/explore/explore-topics';
import ExploreAreasOfInterest from 'layout/explore/explore-areas-of-interest';
import ExploreAreasOfInterestNewArea from 'layout/explore/explore-areas-of-interest-new-area';
import ExploreAreasOfInterestEditArea from 'layout/explore/explore-areas-of-interest-edit-area';
import ExploreCollections from 'layout/explore/explore-collections';
import ExploreLogin from 'layout/explore/explore-login';
import ExploreDiscover from 'layout/explore/explore-discover';
import ExploreNearRealTime from 'layout/explore/explore-near-real-time';
import ExploreFavorites from 'layout/explore/explore-favorites';

// constants
import { EXPLORE_SUBSECTIONS } from 'layout/explore/constants';

// utils
import { breakpoints } from 'utils/responsive';
import { EXPLORE_SECTIONS } from './constants';

function Explore(props) {
  const {
    responsive,
    explore: {
      datasets: { selected },
      sidebar: { section, subsection },
      map: { drawer: { isDrawing } },
    },
    userIsLoggedIn,
    hostname,
    stopDrawing,
  } = props;
  const [mobileWarningOpened, setMobileWarningOpened] = useState(true);
  const [dataset, setDataset] = useState(null);
  const handleClearPolygon = useCallback(() => { stopDrawing(); }, [stopDrawing]);
  const isAuthenticatedSection = useMemo(() => [
    EXPLORE_SECTIONS.COLLECTIONS,
    EXPLORE_SECTIONS.FAVORITES,
    EXPLORE_SECTIONS.AREAS_OF_INTEREST,
  ].includes(section), [section]);

  const getSidebarLayout = () => (
    <>
      {!subsection && (
        <>
          <ExploreMenu />
          <div
            className="explore-sidebar-content"
            id="sidebar-content-container"
            key={section}
          >
            {section === EXPLORE_SECTIONS.ALL_DATA && (
              <ExploreDatasets />
            )}
            {section === EXPLORE_SECTIONS.TOPICS && (
              <ExploreTopics />
            )}
            {section === EXPLORE_SECTIONS.COLLECTIONS && userIsLoggedIn && (
              <ExploreCollections />
            )}
            {section === EXPLORE_SECTIONS.FAVORITES && userIsLoggedIn && (
              <ExploreFavorites />
            )}
            {isAuthenticatedSection && !userIsLoggedIn && (
              <ExploreLogin />
            )}
            {section === EXPLORE_SECTIONS.DISCOVER && (
              <ExploreDiscover />
            )}
            {section === EXPLORE_SECTIONS.NEAR_REAL_TIME && (
              <ExploreNearRealTime />
            )}
            {(section === EXPLORE_SECTIONS.AREAS_OF_INTEREST && userIsLoggedIn) && (
              <ExploreAreasOfInterest />
            )}
          </div>
        </>
      )}
      {selected && (
        <ExploreDetail
          key={selected}
          onDatasetLoaded={(_dataset) => setDataset(_dataset)}
        />
      )}
      {subsection === EXPLORE_SUBSECTIONS.NEW_AREA && (<ExploreAreasOfInterestNewArea />)}
      {subsection === EXPLORE_SUBSECTIONS.EDIT_AREA && (<ExploreAreasOfInterestEditArea />)}
    </>
  );

  const metadata = dataset && dataset.metadata && dataset.metadata[0];
  const infoObj = metadata && metadata.info;
  const titleSt = selected ? infoObj && infoObj.name : '';
  const descriptionSt = selected ? infoObj && infoObj.functions
    : 'Browse more than 200 global data sets on the state of our planet.';

  return (
    <Layout
      title={titleSt}
      description={descriptionSt}
      {...(selected && dataset && { explicitHostname: `${hostname}/${dataset.slug}` })}
      className="-fullscreen"
    >
      <div className="c-page-explore">
        <MediaQuery
          minWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <>
            {/*
              We set this key so that, by rerendering the sidebar, the sections are
              scrolled to the top when the selected section changes.
            */}
            <ExploreSidebar
              key={section}
            >
              {getSidebarLayout()}
            </ExploreSidebar>
            {isDrawing && (
              <div className="clear-polygon-container">
                <button
                  type="button"
                  onClick={handleClearPolygon}
                  className="c-btn -primary -alt"
                >
                  Clear Polygon
                </button>
              </div>
            )}
            <ExploreMap />
          </>
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
              <p>
                The mobile version of Explore has limited functionality,
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
  responsive: PropTypes.shape({
    fakeWidth: PropTypes.number.isRequired,
  }).isRequired,
  explore: PropTypes.shape({
    datasets: PropTypes.shape({
      selected: PropTypes.string,
    }).isRequired,
    sidebar: PropTypes.shape({
      section: PropTypes.string.isRequired,
      subsection: PropTypes.string,
    }).isRequired,
    map: PropTypes.shape({
      drawer: PropTypes.shape({
        isDrawing: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  hostname: PropTypes.string.isRequired,
  stopDrawing: PropTypes.func.isRequired,
  setIsDrawing: PropTypes.func.isRequired,
};

export default Explore;
