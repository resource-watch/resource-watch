import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './similar-datasets-actions';
import reducers, { initialState } from './similar-datasets-reducer';

import SimilarDatasetsComponent from './similar-datasets-component';

class SimilarDatasetsContainer extends Component {
  render() {
    return createElement(SimilarDatasetsComponent, {
      ...this.props
    });
  }
}

SimilarDatasetsContainer.propTypes = {
  similarDatasets: PropTypes.array.isRequired
};

export { actions, reducers, initialState };

export default connect(null, actions)(SimilarDatasetsContainer);
