import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetListItem from './list-item';

// Styles
import './styles.scss';

class DatasetList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    actions: PropTypes.node.isRequired,
    tags: PropTypes.node,
    expandedChart: PropTypes.bool,
    loading: PropTypes.bool,
    numberOfPlaceholders: PropTypes.number
  };

  static defaultProps = {
    expandedChart: false,
    tags: [],
    loading: false,
    numberOfPlaceholders: 4
  }

  render() {
    const {
      list,
      actions,
      tags,
      expandedChart,
      numberOfPlaceholders,
      loading
    } = this.props;
    const placeholders = [];
    for (let i = 0; i < numberOfPlaceholders; i++) {
      placeholders.push(i);
    }

    return (
      <div className="c-explore-dataset-list">
        <Spinner isLoading={loading} className="-light" />
        <div className="l-row row">
          {!loading && list.map(dataset => (
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
          {loading && placeholders.map(e => (
            <div className="column small-12">
              <div
                className="dataset-placeholder"
                key={`dataset-placeholder-${e}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DatasetList;
