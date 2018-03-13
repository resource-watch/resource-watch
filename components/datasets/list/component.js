import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Components
import DatasetListItem from 'components/datasets/list/list-item';

class DatasetList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
    mode: PropTypes.string,
    grid: PropTypes.object,
    actions: PropTypes.node
  };

  static defaultProps = {
    grid: {
      small: 'small-12',
      medium: 'medium-6',
      large: 'large-4',
      xlarge: 'xlarge-4',
      xxlarge: 'xxlarge-4'
    }
  }

  render() {
    const {
      list, mode, actions, grid
    } = this.props;

    const columnClassName = classNames({
      column: true,
      [`-${mode}`]: true,
      [grid.small]: true,
      [grid.medium]: mode === 'grid',
      [grid.large]: mode === 'grid',
      [grid.xlarge]: mode === 'grid',
      [grid.xxlarge]: mode === 'grid'
    });

    return (
      <div className="c-dataset-list">
        <div className="row">
          <div className="l-row -equal-height row">
            {list.map(dataset => (
              <div
                className={columnClassName}
                key={dataset.id}
              >
                <DatasetListItem
                  dataset={dataset}
                  metadata={dataset.metadata}
                  widget={dataset.widget.find(w => w.default)}
                  layer={dataset.layer.find(l => l.default)}
                  mode={mode}
                  actions={actions}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default DatasetList;
