import React from 'react';
import { useRouter } from 'next/router';

// Components
import CollectionsIndex from './tabs/index';
import CollectionsNew from './tabs/new';
import CollectionsEdit from './tabs/edit';

const CollectionsTab = () => {
  const {
    query: {
      id,
    },
  } = useRouter();
  return (
    <>
      {!id && (
        <CollectionsIndex />
      )}

      {(id && id === 'new') && (
        <CollectionsNew />
      )}

      {(id && id !== 'new') && (
        <CollectionsEdit />
      )}
    </>
  );
};

export default CollectionsTab;
