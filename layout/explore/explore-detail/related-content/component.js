import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function RelatedContent(props) {
  const { datasets: { list, loading }, setSelectedDataset } = props;
  
  return (
    <div className="c-related-content">
      <h3>Related content</h3>
      <DatasetList
        list={list}
        loading={loading}
        numberOfPlaceholders={3}
        actions={<ExploreDatasetsActions />}
        expandedChart
      />
      <div className="actions">
        <button
          className="c-button -secondary"
          onClick={() => setSelectedDataset(null)}
        >
            See all datasets
        </button>
      </div>
    </div>
  );
}

RelatedContent.propTypes = {
  datasets: PropTypes.array.isRequired,
  setSelectedDataset: PropTypes.func.isRequired
};

export default RelatedContent;
