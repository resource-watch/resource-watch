import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

// components
import AreaCardList from 'components/areas/card-list';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/icon';
import Paginator from 'components/ui/Paginator';
import ExploreAreasOfInterestIntro from 'layout/explore/explore-areas-of-interest/intro';

// constants
import { EXPLORE_SUBSECTIONS } from 'layout/explore/constants';

// hooks
import usePaginatedUserAreas from 'hooks/user-areas/paginated-user-areas';

// styles
import './styles.scss';

const ExploreAreasOfInterest = ({
  token,
  areasOnMap,
  setSidebarSubsection,
  setSelectedItem,
  toggleArea,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    size: 0,
  });
  const {
    resolvedData: {
      areas: userAreas,
      meta,
    },
    isFetching,
    isSuccess,
    isFetchedAfterMount,
    refetch,
  } = usePaginatedUserAreas(token, {
    'page[size]': pagination.limit,
    'page[number]': pagination.page,
    sort: '-updatedAt',
  });
  const handleNewArea = useCallback(() => {
    setSidebarSubsection(EXPLORE_SUBSECTIONS.NEW_AREA);
  }, [setSidebarSubsection]);
  const handlePagination = useCallback((_nextPage) => {
    setPagination({
      ...pagination,
      page: _nextPage,
    });
  }, [pagination]);
  const handleMapView = useCallback(
    ({ id, geostore }) => {
      toggleArea({ id, geostore });
    }, [toggleArea],
  );
  const handleAreaEdition = useCallback(({ id }) => {
    setSelectedItem(id);
    setSidebarSubsection(EXPLORE_SUBSECTIONS.EDIT_AREA);
  }, [setSelectedItem, setSidebarSubsection]);
  const handleDeletionArea = useCallback(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: 1,
    }));
    refetch();
  }, [refetch]);

  const areas = useMemo(
    () => userAreas.map((_area) => ({ ..._area, isVisible: areasOnMap.includes(_area.id) })),
    [userAreas, areasOnMap],
  );

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      size: meta['total-items'],
    }));
  }, [meta]);

  return (
    <div className="c-explore-areas-of-interest">
      <div className="menu">
        <button
          className="c-button -quaternary -compressed -fs-tiny"
          type="button"
          onClick={handleNewArea}
        >
          <Icon name="icon-plus" />
          New Area
        </button>
      </div>

      <ExploreAreasOfInterestIntro />

      <div className="user-areas-header">
        <h4>Your saved areas</h4>
        {isFetching && (
          <Spinner
            isLoading
            className="-tiny -transparent -right"
          />
        )}
      </div>
      {(isSuccess && isFetchedAfterMount) && (
        <>
          <AreaCardList
            areas={areas}
            isColumn
            enableSubscriptions={false}
            onMapView={handleMapView}
            onEditArea={handleAreaEdition}
            onDeletionArea={handleDeletionArea}
          />

          {(pagination.size > pagination.limit) && (
            <Paginator
              options={pagination}
              onChange={handlePagination}
            />
          )}
        </>
      )}
    </div>
  );
};

ExploreAreasOfInterest.propTypes = {
  token: PropTypes.string.isRequired,
  areasOnMap: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  setSidebarSubsection: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  toggleArea: PropTypes.func.isRequired,
};

export default ExploreAreasOfInterest;
