import PropTypes from 'prop-types';

// components
import DatasetCardList from 'components/datasets/card-list';
import MiniExploreDatasetsActions from './dataset-actions';

export default function DatasetsSidebar({
  datasetGroups,
  handleAddMap,
}) {
  return (
    <div className="datasets-sidebar">
      {datasetGroups.map((group) => {
        const {
          title,
          datasets,
        } = group;
        const datasetCounter = `${datasets.length} dataset${(datasets.length > 1) ? 's' : ''}`;

        return (
          <div
            key={`${title}-${datasetCounter}`}
            className="dataset-group"
          >
            <div className="group-header">
              <h4>
                {title}
              </h4>
              <div className="number-of-datasets">
                {datasetCounter}
              </div>
            </div>
            <DatasetCardList
              numberOfPlaceholders={2}
              list={datasets}
              actions={(
                <MiniExploreDatasetsActions
                  handleAddMap={handleAddMap}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

DatasetsSidebar.propTypes = {
  datasetGroups: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      datasets: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
      default: PropTypes.string,
    }),
  ).isRequired,
  handleAddMap: PropTypes.func.isRequired,
};
