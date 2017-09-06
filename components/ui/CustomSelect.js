import React from 'react';
import PropTypes from 'prop-types';
import SliderSelect from './SliderSelect';
import SearchSelect from './SearchSelect';

function CustomSelect(props) {
  const { search, ...newProps } = props;
  return search ? <SearchSelect {...newProps} /> : <SliderSelect {...newProps} />;
}

CustomSelect.propTypes = {
  search: PropTypes.bool
};

export default CustomSelect;
