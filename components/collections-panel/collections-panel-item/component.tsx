import React, { useCallback } from 'react';
import classnames from 'classnames';

// types
import type { Collection } from 'types/collection';

export interface CollectionPanelItemProps {
  collection: Pick<Collection, 'id' | 'name' | 'resources'>;
  isChecked: boolean;
  onToggleCollection: (
    isChecked: boolean,
    collection: Pick<Collection, 'id' | 'name' | 'resources'>,
  ) => void;
}

const CollectionPanelItem = ({
  collection,
  isChecked,
  onToggleCollection,
}: CollectionPanelItemProps): JSX.Element => {
  const onCheck = useCallback(
    (evt) => {
      const newIsChecked = evt.currentTarget.checked;
      onToggleCollection(newIsChecked, collection);
    },
    [collection, onToggleCollection],
  );

  const { name } = collection;
  const collectionItemClass = classnames({
    'collection-item': true,
    '-selected': isChecked,
  });

  return (
    <li className={collectionItemClass}>
      <span className="fake-checkbox" />
      <input type="checkbox" name={name} onChange={onCheck} defaultChecked={isChecked} />
      <span className="collection-name">{name}</span>
    </li>
  );
};

export default CollectionPanelItem;
