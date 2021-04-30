import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import SearchInput from 'components/ui/SearchInput';
import CustomTable from 'components/ui/customtable/CustomTable';
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';
import NameTD from './td/name';
import RelatedContentTD from './td/related-content';

const CollectionsList = ({
  pagination,
  collections,
  onRowDelete,
  onChangePage,
}) => {
  const [searchState, setSearchState] = useState(null);

  const handleSearch = useCallback((value) => {
    if (value.length > 0 && value.length < 3) return false;
    return setSearchState(value);
  }, []);

  const filteredCollections = useMemo(() => {
    if (!searchState || searchState === '') return collections;

    const regex = new RegExp(searchState, 'gi');
    return collections.filter(({ name }) => regex.test(name));
  }, [collections, searchState]);

  return (
    <>
      <SearchInput
        input={{
          placeholder: 'Search collections',
          value: searchState,
        }}
        link={{
          label: 'New Collection',
          route: '/myrw-detail/collections/new',
          // params: {
          //   tab: 'collections',
          //   id: 'new',
          // },
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
              onRowDelete,
              component: DeleteAction,
            },
          ],
        }}
        sort={{
          field: 'name',
          value: 1,
        }}
        filters={false}
        data={filteredCollections}
        onRowDelete={onRowDelete}
        onChangePage={onChangePage}
        pagination={pagination}
      />
    </>
  );
};

CollectionsList.propTypes = {
  pagination: PropTypes.shape({
    size: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }).isRequired,
  collections: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  onChangePage: PropTypes.func.isRequired,
  onRowDelete: PropTypes.func.isRequired,
};

export default CollectionsList;
