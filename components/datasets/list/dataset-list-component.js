import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Components
import DatasetWidget from 'components/app/explore/DatasetWidget';

class DatasetList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
    user: PropTypes.object,
    routes: PropTypes.object,
    mode: PropTypes.string,
    showActions: PropTypes.bool.isRequired,
    showFavorite: PropTypes.bool.isRequired,
    onTagSelected: PropTypes.func
  };

  render() {
    const {
      list, mode, showActions, showFavorite, user, routes, onTagSelected
    } = this.props;

    const newClassName = classNames({
      column: true,
      [`-${mode}`]: true,
      'small-12': true,
      'medium-6': mode === 'grid',
      [routes.pathname === '/app/Explore' ? 'xxlarge-4' : 'large-4']: mode === 'grid'
    });

    return (
      <div className="c-dataset-list">
        <div className="l-row -equal-height row">
          {list.map(dataset => (
            <div className={newClassName} key={dataset.id}>
              <DatasetWidget
                dataset={dataset}
                favourite={user.favourites.items.find(f => f.attributes.resourceId === dataset.id)}
                widget={dataset.attributes.widget.find(w => w.attributes.default)}
                layer={dataset.attributes.layer.find(l => l.attributes.default)}
                mode={mode}
                showActions={showActions}
                showFavorite={showFavorite}
                onTagSelected={tag => onTagSelected(tag)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DatasetList;
