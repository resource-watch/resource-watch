import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import AreasForm from 'components/areas/AreasForm';
import Map from 'components/ui/map/Map';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

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
