import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import Aside from 'components/ui/Aside';

// hooks
import useFetchCollections from 'hooks/collection/fetch-collections';

const TAB_TO_TYPE = {
  widgets: 'widget',
  datasets: 'dataset',
};

const CollectionListAside = ({
  token,
  selected,
  additionalTabs,
}) => {
  const {
    query: {
      tab,
    },
  } = useRouter();
  const {
    data: collections,
  } = useFetchCollections(
    token,
    {
      sort: 'name',
    },
    {
      initialData: [],
      initialStale: true,
    },
  );

  const parsedCollections = useMemo(() => collections
    // displays collection with at least one resource
    // and the resource type must be match according to the visited tab
    .filter((_collection) => _collection.resources.length
      && _collection.resources.filter(({ type }) => type === TAB_TO_TYPE[tab]).length)
    .map(({ id, name }) => ({
      id,
      label: name,
      value: id,
      route: 'myrw',
      params: {
        tab,
        subtab: id,
      },
    })), [collections, tab]);

  const tabs = [...additionalTabs, ...parsedCollections];

  return (
    <Aside
      items={tabs}
      selected={selected}
    />
  );
};

CollectionListAside.defaultProps = { additionalTabs: [] };

CollectionListAside.propTypes = {
  token: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  additionalTabs: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

export default CollectionListAside;
