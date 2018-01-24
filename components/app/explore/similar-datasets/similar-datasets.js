import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './similar-datasets-actions';
import * as reducers from './similar-datasets-reducer';
import initialState from './similar-datasets-initial-state';

import SimilarDatasetsComponent from './similar-datasets-component';

const mapStateToProps = state => ({
  data: state.data,
  loading: state.loading,
  error: state.error
});

class SimilarDatasetsContainer extends Component {
  componentDidMount() {
    this.props.getSimilarDatasets(this.props.datasetId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.datasetId !== nextProps.datasetId) {
      this.props.getSimilarDatasets(nextProps.datasetId);
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

SimilarDatasetsContainer.propTypes = {
  datasetId: PropTypes.string.isRequired,
  getSimilarDatasets: PropTypes.func.isRequired,
  resetSimilarDatasets: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SimilarDatasetsContainer);
