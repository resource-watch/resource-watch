import React from 'react';
import { useRouter } from 'next/router';

// Components
import CollectionsIndex from 'components/app/myrw/collections/pages/index';
import CollectionsNew from 'components/app/myrw/collections/pages/new';
import CollectionsEdit from 'components/app/myrw/collections/pages/edit';

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
