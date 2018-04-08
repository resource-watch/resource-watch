import React from 'react';
import PropTypes from 'prop-types';

// Components
import Geosuggest from 'react-geosuggest';

class LocationSearch extends React.Component {
  render() {
    const { handleOnSuggestSelect } = this.props;
    return (
      <Geosuggest
        onSuggestSelect={handleOnSuggestSelect}
      />
    );
  }
}

LocationSearch.propTypes = {
  handleOnSuggestSelect: PropTypes.func.isRequired
};

export default LocationSearch;
