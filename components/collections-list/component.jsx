import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';
import NameTD from './td/name';
import RelatedContentTD from './td/related-content';

// constants
import { INITIAL_PAGINATION } from './constants';

const CollectionsList = ({
  collections,
  onRowDelete,
}) => {
  const [paginationState, setPaginationState] = useState(INITIAL_PAGINATION);
  const [searchState, setSearchState] = useState(null);

  const handleSearch = useCallback((value) => {
    if (value.length > 0 && value.length < 3) return false;
    return setSearchState(value);
  }, []);

  const handlePageChange = useCallback((page) => {
    setPaginationState((prevPaginationState) => ({
      ...prevPaginationState,
      page,
    }));
  }, []);

  const filteredCollections = useMemo(() => {
    if (!searchState || searchState === '') return collections;

    const regex = new RegExp(searchState, 'gi');
    return collections.filter(({ name }) => regex.test(name));
  }, [collections, searchState]);

  return (
    <div className="c-dataset-table">
      <SearchInput
        input={{
          placeholder: 'Search collections',
          value: searchState,
        }}
        link={{
          label: 'New Collection',
          route: 'myrw_detail',
          params: {
            tab: 'collections',
            id: 'new',
          },
        }}
        onSearch={handleSearch}
      />
      <CustomTable
        columns={[
          {
            label: 'Name',
            value: 'name',
            td: NameTD,
            tdProps: { route: 'myrw_detail' },
            params: {
              tab: 'collections',
              id: '{{id}}',
            },
          },
          {
            label: 'Related content',
            value: 'resources',
            td: RelatedContentTD,
          },
        ]}
        actions={{
          show: true,
          list: [
            {
              name: 'Edit',
              params: { tab: 'collections', subtab: '{{id}}' },
              show: true,
              component: EditAction,
            },
            {
              name: 'Remove',
              route: 'myrw_detail',
              params: { tab: 'collections', subtab: 'remove', id: '{{id}}' },
              component: DeleteAction,
            },
          ],
        }}
        sort={{
          field: 'updatedAt',
          value: -1,
        }}
        filters={false}
        data={filteredCollections}
        onRowDelete={onRowDelete}
        manualPagination
        onChangePage={handlePageChange}
        pagination={paginationState}
      />
    </div>
  );
};

CollectionsList.propTypes = {
  collections: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  onRowDelete: PropTypes.func.isRequired,
};

export default CollectionsList;
