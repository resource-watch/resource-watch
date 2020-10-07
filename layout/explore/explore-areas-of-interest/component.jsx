import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// components
import AreaCardList from 'components/areas/card-list';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/icon';
import Paginator from 'components/ui/Paginator';

// constants
import { EXPLORE_SUBSECTIONS } from 'layout/explore/constants';

// hooks
import usePaginatedUserAreas from 'hooks/user-areas/paginated-user-areas';

// styles
import './styles.scss';

const ExploreAreasOfInterest = ({
  token,
  setSidebarSubsection,
  setSelectedItem,
  setGeostore,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    size: 15,
  });
  const { page } = pagination;
  const {
    resolvedData,
    isFetching,
    isSuccess,
    refetch,
  } = usePaginatedUserAreas(token, page);
  const handleNewArea = useCallback(() => {
    setSidebarSubsection(EXPLORE_SUBSECTIONS.NEW_AREA);
  }, [setSidebarSubsection]);
  const handlePagination = useCallback((_nextPage) => {
    setPagination({
      ...pagination,
      page: _nextPage,
    });
  }, [pagination]);
  const handleMapView = useCallback(({ geostore }) => { setGeostore(geostore); }, [setGeostore]);
  const handleAreaEdition = useCallback(({ id }) => {
    setSelectedItem(id);
    setSidebarSubsection(EXPLORE_SUBSECTIONS.EDIT_AREA);
  }, [setSelectedItem, setSidebarSubsection]);
  const handleDeletionArea = useCallback(() => { refetch(); }, [refetch]);

  return (
    <div className="c-explore-areas-of-interest">
      <div className="menu">
        <button
          className="c-button"
          type="button"
          onClick={handleNewArea}
        >
          <Icon name="icon-plus" />
          New Area
        </button>

      </div>
      {isFetching && (
        <Spinner
          isLoading
          className="-transparent"
        />
      )}
      {(isSuccess && resolvedData.length > 0) && (
        <>
          <h4>Your saved areas</h4>
          <AreaCardList
            areas={resolvedData}
            isColumn
            showNewArea={false}
            onMapView={handleMapView}
            onEditArea={handleAreaEdition}
            onDeletionArea={handleDeletionArea}
          />
          <Paginator
            options={pagination}
            onChange={handlePagination}
          />
        </>
      )}
    </div>
  );
};

ExploreAreasOfInterest.propTypes = {
  token: PropTypes.string.isRequired,
  setSidebarSubsection: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setGeostore: PropTypes.func.isRequired,
};

export default ExploreAreasOfInterest;
