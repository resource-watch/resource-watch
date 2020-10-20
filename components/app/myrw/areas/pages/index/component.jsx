import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { useRouter } from 'next/router';

// components
import Spinner from 'components/ui/Spinner';
import AreaCardList from 'components/areas/card-list';
import Paginator from 'components/ui/Paginator';

// hooks
import usePaginatedUserAreas from 'hooks/user-areas/paginated-user-areas';

// styles
import './styles.scss';

const AreasIndex = ({
  token,
}) => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
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

  const handlePagination = useCallback((_nextPage) => {
    setPagination({
      ...pagination,
      page: _nextPage,
    });
  }, [pagination]);

  const handleMapView = useCallback(
    ({ id, geostore }) => {
      router.push(`/data/explore?area=${id}&geostore=${geostore}`);
    }, [router],
  );

  const handleAreaEdition = useCallback(
    ({ id }) => {
      router.push(`/myrw-detail/areas/${id}`);
    }, [router],
  );

  const handleDeletionArea = useCallback(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: 1,
    }));
    refetch();
  }, [refetch]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      size: meta['total-items'],
    }));
  }, [meta]);

  return (
    <div className="c-areas-index">
      <div className="c-button-container">
        <ul>
          <li>
            <Link href="/myrw-detail/areas/new">
              <button
                type="button"
                className="c-button -secondary"
              >
                New area
              </button>
            </Link>
          </li>
        </ul>
      </div>

      {isFetching && (
        <Spinner
          isLoading
          className="-light"
        />
      )}

      {(isSuccess && isFetchedAfterMount) && (
        <>
          <AreaCardList
            areas={userAreas}
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

AreasIndex.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AreasIndex;
