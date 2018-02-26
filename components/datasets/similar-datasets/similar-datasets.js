import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './similar-datasets-actions';
import * as reducers from './similar-datasets-reducer';
import initialState from './similar-datasets-initial-state';

import SimilarDatasetsComponent from './similar-datasets-component';

class SimilarDatasetsContainer extends Component {
  static propTypes = {
    datasetIds: PropTypes.array.isRequired,
    getSimilarDatasets: PropTypes.func.isRequired,
    resetSimilarDatasets: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getSimilarDatasets(this.props.datasetIds.join());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.datasetIds !== nextProps.datasetIds) {
      this.props.getSimilarDatasets(nextProps.datasetIds.join());
    }
  }

  componentWillUnmount() {
    this.props.resetSimilarDatasets();
  }

  render() {
    return createElement(SimilarDatasetsComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(
  state => ({
    ...state.similarDatasets
  }),
  actions
)(SimilarDatasetsContainer);
