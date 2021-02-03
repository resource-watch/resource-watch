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
    actions: PropTypes.node,
    tags: PropTypes.node,
  };

  static defaultProps = {
    grid: {
      small: 'small-12',
      medium: 'medium-6',
      large: 'large-4',
      xlarge: 'xlarge-4',
      xxlarge: 'xxlarge-4',
    },
  }

  render() {
    const {
      list, mode, actions, tags, grid,
    } = this.props;

    const columnClassName = classNames({
      column: true,
      [`-${mode}`]: true,
      [grid.small]: true,
      [grid.medium]: mode === 'grid',
      [grid.large]: mode === 'grid',
      [grid.xlarge]: mode === 'grid',
      [grid.xxlarge]: mode === 'grid',
    });

    return (
      <div className={`c-dataset-list -${mode}`}>
        <div className="row">
          <div className="column small-12">
            <div className="l-row -equal-height row">
              {list.map((dataset) => (
                <div
                  className={columnClassName}
                  key={dataset.id}
                >
                  <DatasetListItem
                    dataset={dataset}
                    widget={dataset.widget ? dataset.widget.find((w) => w.default) : null}
                    layer={dataset.layer ? dataset.layer.find((l) => l.default) : null}
                    metadata={dataset.metadata && Array.isArray(dataset.metadata)
                      ? dataset.metadata[0] : dataset.metadata}
                    vocabulary={dataset.vocabulary
                      ? dataset.vocabulary.find((v) => v.name === 'knowledge_graph') || {} : null}
                    mode={mode}
                    actions={actions}
                    tags={tags}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DatasetList;
