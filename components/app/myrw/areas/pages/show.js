import React from 'react';
import PropTypes from 'prop-types';

// Components
import AreasForm from 'components/areas/AreasForm';

function AreasEdit(props) {
  return (
    <div className="c-areas-edit">
      <AreasForm
        mode="edit"
        id={props.id}
      />
    </div>
  );
}

AreasEdit.propTypes = {
  id: PropTypes.string
};

export default AreasEdit;
