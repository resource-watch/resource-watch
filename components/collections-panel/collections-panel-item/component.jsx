import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Spinner from 'components/ui/Spinner';

const CollectionPanelItem = ({
  collection,
  isChecked,
  loading,
  onToggleCollection,
}) => {
  const onCheck = useCallback((evt) => {
    const newIsChecked = evt.currentTarget.checked;
    onToggleCollection(newIsChecked, collection);
  }, [collection, onToggleCollection]);

  const { name } = collection;
  const collectionItemClass = classnames({
    'collection-item': true,
    '-selected': isChecked,
  });

  return (
    <li className={collectionItemClass}>
      {loading && (
        <Spinner
          isLoading
          className="-transparent -tiny -pink-icon"
          style={{
            left: 'auto',
            right: 5,
          }}
        />
      )}
      <span className="fake-checkbox" />
      <input
        type="checkbox"
        name={name}
        onChange={onCheck}
        defaultChecked={isChecked}
      />
      <span className="collection-name">{name}</span>
    </li>
  );
};

CollectionPanelItem.defaultProps = {
  collection: {},
  isChecked: false,
  onToggleCollection: () => {},
};

CollectionPanelItem.propTypes = {
  collection: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  isChecked: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  onToggleCollection: PropTypes.func,
};

export default CollectionPanelItem;
