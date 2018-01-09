import React from 'react';
import PropTypes from 'prop-types';

// Components
import AreasForm from 'components/areas/AreasForm';

function AreasNew(props) {
  return (
    <div className="c-areas-new">
      <AreasForm
        mode="new"
        query={props.query}
      />
    </div>
  );
}

AreasNew.propTypes = {
  query: PropTypes.object
};

export default AreasNew;
