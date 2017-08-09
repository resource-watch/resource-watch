import React from 'react';
import find from 'lodash/find';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getDatasets, setFilters } from 'redactions/admin/datasets';

// Selectors
import getFilteredDatasets from 'selectors/admin/datasets';

// Components
import DatasetsWidget from 'components/datasets/list/DatasetsWidget';

class DatasetsList extends React.Component {
  componentDidMount() {
    this.props.setFilters([]);
    this.props.getDatasets();
  }

  render() {
    const { datasets, mode, showActions } = this.props;

    const newClassName = classNames({
      column: true,
      'list-item': true,
      'small-12': true,
      'medium-4': mode === 'grid',
      [`-${mode}`]: true
    });

    return (
      <div className="c-dataset-list">
        <div className="l-row row list">
          {datasets.map(dataset =>
            (<div className={newClassName} key={dataset.id}>
              <DatasetsWidget
                dataset={dataset}
                widget={find(dataset.attributes.widget, { attributes: { default: true } })}
                layer={find(dataset.attributes.layer, { attributes: { default: true } })}
                mode={mode}
                showActions={showActions}
              />
            </div>)
          )}
        </div>
      </div>
    );
  }
}

DatasetsList.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  showActions: true,
  // Store
  datasets: [],
  mode: 'grid'
};

DatasetsList.propTypes = {
  routes: PropTypes.object,
  mode: PropTypes.string,
  showActions: PropTypes.bool,

  // Store
  user: PropTypes.object,
  datasets: PropTypes.array.isRequired,

  // Actions
  getDatasets: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.datasets.datasets.loading,
  datasets: getFilteredDatasets(state),
  error: state.datasets.datasets.error
});
const mapDispatchToProps = dispatch => ({
  getDatasets: () => dispatch(getDatasets()),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsList);
