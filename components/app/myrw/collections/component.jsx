import PropTypes from 'prop-types';

// Components
import CollectionsIndex from './tabs/index';
import CollectionsNew from './tabs/new';
import CollectionsEdit from './tabs/edit';

export default function CollectionsTab({
  id,
}) {
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
}

CollectionsTab.defaultProps = {
  id: null,
};

CollectionsTab.propTypes = {
  id: PropTypes.string,
};
