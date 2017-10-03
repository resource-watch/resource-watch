import React from 'react';
import find from 'lodash/find';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Components
import DatasetWidget from 'components/app/explore/DatasetWidget';

const DatasetList = (props) => {
  const { list, mode, showActions } = props;

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
              widget={find(dataset.attributes.widget, { attributes: { default: true } })}
              layer={find(dataset.attributes.layer, { attributes: { default: true } })}
              mode={mode}
              showActions={showActions}
              onTagSelected={tag => props.onTagSelected(tag)}
            />
          </div>)
        )}
      </div>
    </div>
  );
};

DatasetList.propTypes = {
  list: PropTypes.array,
  mode: PropTypes.string,
  showActions: PropTypes.bool.isRequired,

  // Callbacks
  onTagSelected: PropTypes.func
};

export default DatasetList;
