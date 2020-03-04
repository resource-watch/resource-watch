import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Components
import DatasetListItem from './list-item';

class DatasetList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
    actions: PropTypes.node,
    tags: PropTypes.node
  };

  render() {
    const { list, actions, tags } = this.props;

    const columnClassName = classNames({
      column: true,
      'small-12': true
    });

    return (
      <div className="c-explore-dataset-list">
        <div className="row">
          <div className="column small-12">
            <div className="l-row -equal-height row">
              {list.map(dataset => (
                <div
                  className={columnClassName}
                  key={dataset.id}
                >
                  <DatasetListItem
                    dataset={dataset}
                    widget={dataset.widget ? dataset.widget.find(w => w.default) : null}
                    layer={dataset.layer ? dataset.layer.find(l => l.default) : null}
                    metadata={dataset.metadata && Array.isArray(dataset.metadata) ?
                      dataset.metadata[0] : dataset.metadata}
                    vocabulary={dataset.vocabulary ?
                      dataset.vocabulary.find(v => v.name === 'knowledge_graph') || {} : null}
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
