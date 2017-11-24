import React from 'react';
import find from 'lodash/find';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Components
import DatasetWidget from 'components/app/explore/DatasetWidget';

function DatasetList(props) {
  const { list, mode, showActions, showFavorite, favorites } = props;

  const newClassName = classNames({
    column: true,
    'list-item': true,
    'small-12': true,
    'medium-4': mode === 'grid',
    [`-${mode}`]: true
  });

  return (
    <div className="c-dataset-list">
      <div className="l-row row list">
        {list.map(dataset =>
          (<div className={newClassName} key={dataset.id}>
            <DatasetWidget
              dataset={dataset}
              favorite={favorites && favorites.find(elem =>
                elem.attributes.resourceId === dataset.id)}
              widget={find(dataset.attributes.widget, { attributes: { default: true } })}
              layer={find(dataset.attributes.layer, { attributes: { default: true } })}
              mode={mode}
              showActions={showActions}
              showFavorite={showFavorite}
              onTagSelected={tag => props.onTagSelected(tag)}
              onFavoriteRemoved={favorite => props.onFavoriteRemoved(favorite)}
            />
          </div>)
        )}
      </div>
    </div>
  );
}

DatasetList.propTypes = {
  list: PropTypes.array,
  favorites: PropTypes.array,
  mode: PropTypes.string,
  showActions: PropTypes.bool.isRequired,
  showFavorite: PropTypes.bool.isRequired,

  // Callbacks
  onTagSelected: PropTypes.func, // eslint-disable-line
  onFavoriteRemoved: PropTypes.func // eslint-disable-line
};

export default DatasetList;
