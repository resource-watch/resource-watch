import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './explore-dataset-filters-actions';
import * as reducers from './explore-dataset-filters-reducer';
import { initialState } from './explore-dataset-filters-reducer';

import ExploreDatasetFiltersComponent from './explore-dataset-filters-component';
import getFilterStatus from './explore-dataset-filters-selectors';

const mapStateToProps = state => ({
  data: getFilterStatus(state)
});

class ExploreDatasetFiltersContainer extends Component {
  componentDidMount() {
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

export default connect(mapStateToProps, actions)(ExploreDatasetFiltersContainer);
