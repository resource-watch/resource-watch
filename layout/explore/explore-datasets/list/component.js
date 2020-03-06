import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetListItem from './list-item';

class DatasetList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    actions: PropTypes.node.isRequired,
    tags: PropTypes.node,
    expandedChart: PropTypes.bool
  };

  static defaultProps = {
    expandedChart: false,
    tags: []
  }

  render() {
    const { list, actions, tags, expandedChart } = this.props;

    return (
      <div className="c-explore-dataset-list">
        <div className="l-row -equal-height row">
          {list.map(dataset => (
            <div
              className="column small-12"
              key={dataset.id}
            >
              <DatasetListItem
                dataset={dataset}
                widget={dataset.widget ? dataset.widget.find(w => w.default) : null}
                layer={dataset.layer ? dataset.layer.find(l => l.default) : null}
                metadata={dataset.metadata && Array.isArray(dataset.metadata) ?
                  dataset.metadata[0] : dataset.metadata}
                actions={actions}
                tags={tags}
                expandedChart={expandedChart}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DatasetList;
