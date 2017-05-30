import React from 'react';
import SliderSelect from './SliderSelect';
import SearchSelect from './SearchSelect';

function CustomSelect(props) {
  const { search, ...newProps } = props;
  return search ? <SearchSelect {...newProps} /> : <SliderSelect {...newProps} />;
}

CustomSelect.propTypes = {
  search: React.PropTypes.bool
};

export default CustomSelect;
