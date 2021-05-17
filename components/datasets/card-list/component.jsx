import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';
import DatasetListItem from '../card-item';

// styles
import './styles.scss';

export default function DatasetCardList({
  list,
  actions,
  tags,
  expandedChart,
  numberOfPlaceholders,
  loading,
}) {
  const placeholders = useMemo(() => new Array(numberOfPlaceholders), [numberOfPlaceholders]);

  return (
    <div className="c-dataset-card-list">
      {loading && (
        <Spinner
          isLoading
          className="-light"
        />
      )}
      <>
        {!loading && list.map((dataset) => (
          <div
            className="dataset-card-list-item-container"
            key={dataset.id}
          >
            <DatasetListItem
              dataset={dataset}
              widget={dataset.widget ? dataset.widget.find((w) => w.default) : null}
              layer={dataset.layer ? dataset.layer.find((l) => l.default) : null}
              metadata={dataset.metadata && Array.isArray(dataset.metadata)
                ? dataset.metadata[0] : dataset.metadata}
              actions={actions}
              tags={tags}
              expandedChart={expandedChart}
            />
          </div>
        ))}
        {loading && placeholders.map((e) => (
          <div
            className="column small-12"
            key={`dataset-placeholder-${e}`}
          >
            <div className="dataset-placeholder" />
          </div>
        ))}
      </>
    </div>
  );
}

DatasetCardList.defaultProps = {
  expandedChart: false,
  tags: [],
  loading: false,
  numberOfPlaceholders: 4,
};

DatasetCardList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({

    }),
  ).isRequired,
  actions: PropTypes.node.isRequired,
  tags: PropTypes.node,
  expandedChart: PropTypes.bool,
  loading: PropTypes.bool,
  numberOfPlaceholders: PropTypes.number,
};
