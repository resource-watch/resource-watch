import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from './search-actions';
import reducers from './search-reducers';
import initialState from './search-default-state';

import SearchComponent from './search-component';

// Mandatory
export {
  actions, reducers, initialState
};


class Search extends React.Component {
  componentDidMount() {
    const addSearchConfigScript = document.createElement('script');
    addSearchConfigScript.innerHTML = 'window.addsearch_settings = { display_url: true, display_category: false, display_resultscount: true }';

    const addSearchLibScript = document.createElement('script');
    addSearchLibScript.src = `https://addsearch.com/js/?key=${process.env.ADD_SEARCH_KEY}`;
    addSearchLibScript.async = true;

    document.body.appendChild(addSearchConfigScript);
    document.body.appendChild(addSearchLibScript);
  }

  componentDidUpdate() {
    if (this.props.search.opened) {
      // If we don't wait until animation is over it won't focus
      // If we only animate opcity it won't make the leave animation
      setTimeout(() => {
        this.input.focus();

        // Prevent body scroll
        document.documentElement.classList.add('-no-scroll');
        document.body.classList.add('-no-scroll');
      }, 160);
    } else {
      this.input.value = '';
      this.input.blur();

      // Allow body scroll
      document.documentElement.classList.remove('-no-scroll');
      document.body.classList.remove('-no-scroll');
    }
  }

  getInputRef = (c) => {
    this.input = c;
  }

  render() {
    return createElement(SearchComponent, {
      ...this.props,
      getInputRef: this.getInputRef
    });
  }
}

Search.propTypes = {
  search: PropTypes.object
};

export default connect(
  state => ({
    search: state.search
  }),
  actions
)(Search);
