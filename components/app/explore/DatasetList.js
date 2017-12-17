import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Components
import DatasetWidget from 'components/app/explore/DatasetWidget';

function DatasetList(props) {
  const { list, mode, showActions, showFavorite, user } = props;

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
              favourite={user.favourites.find(f => f.attributes.resourceId === dataset.id)}
              widget={dataset.attributes.widget.find(w => w.attributes.default)}
              layer={dataset.attributes.layer.find(l => l.attributes.default)}
              mode={mode}
              showActions={showActions}
              showFavorite={showFavorite}
              onTagSelected={tag => props.onTagSelected(tag)}
            />
          </div>)
        )}
      </div>
    </div>
  );
}

DatasetList.propTypes = {
  list: PropTypes.array,
  user: PropTypes.object,
  mode: PropTypes.string,
  showActions: PropTypes.bool.isRequired,
  showFavorite: PropTypes.bool.isRequired,

  // Callbacks
  onTagSelected: PropTypes.func, // eslint-disable-line
  onFavoriteRemoved: PropTypes.func // eslint-disable-line
};

export default connect(
  state => ({
    user: state.user
  })
)(DatasetList);
