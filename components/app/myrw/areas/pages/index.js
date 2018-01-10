import React from 'react';
import PropTypes from 'prop-types';

// Components
import AreasList from 'components/areas/AreasList';

function AreasIndex(props) {
  return (
    <div className="c-areas-index">
      <AreasList query={props.query} />
    </div>
  );
}

AreasIndex.propTypes = {
  query: PropTypes.object
};

export default AreasIndex;
