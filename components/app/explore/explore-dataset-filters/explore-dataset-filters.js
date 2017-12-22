import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './explore-dataset-filters-actions';
import reducers, { initialState } from './explore-dataset-filters-reducer';

import ExploreDatasetFiltersComponent from './explore-dataset-filters-component';
import getFilterStatus from './explore-dataset-filters-selectors';

class ExploreDatasetFiltersContainer extends Component {
  componentWillMount() {
    this.props.getFiltersData();
  }

  render() {
    return createElement(ExploreDatasetFiltersComponent, {
      ...this.props
    });
  }
}

ExploreDatasetFiltersContainer.propTypes = {
  getFiltersData: PropTypes.func
};

export { actions, reducers, initialState };

const mapStateToProps = state => ({
  data: getFilterStatus(state)
});

export default connect(mapStateToProps, actions)(ExploreDatasetFiltersContainer);
