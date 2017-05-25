import React from 'react';
import find from 'lodash/find';
import classNames from 'classnames';

// Components
import DatasetWidget from 'components/app/explore/DatasetWidget';

class DatasetList extends React.Component {
  render() {
    const { active, list, mode } = this.props;

    const newClassName = classNames({
      column: true,
      'list-item': true,
      'small-12': true,
      'medium-4': mode === 'grid',
      [`-${mode}`]: true
    });

    return (
      <div className="c-dataset-list">
        <div className="list row">
          {list.map(dataset =>
            <div className={newClassName} key={dataset.id}>
              <DatasetWidget
                active={active.includes(dataset.id)}
                dataset={dataset}
                widget={find(dataset.attributes.widget, { attributes: { default: true } })}
                layer={find(dataset.attributes.layer, { attributes: { default: true } })}
                mode={mode}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

DatasetList.propTypes = {
  list: React.PropTypes.array,
  active: React.PropTypes.array,
  mode: React.PropTypes.string
};

export default DatasetList;
